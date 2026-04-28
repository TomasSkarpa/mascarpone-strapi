/**
 * scheduled-fal-image service: fal Model API calls and Strapi media updates.
 */

import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { factories } from "@strapi/strapi"
import { ApiError, fal } from "@fal-ai/client"

import type { Core } from "@strapi/strapi"

const UID = "api::scheduled-fal-image.scheduled-fal-image" as const
const FOLDER_UID = "plugin::upload.folder" as const

const STALE_RUNNING_MS = 45 * 60 * 1000

type FalResultData = Record<string, unknown>

type SourceImageFields =
  | { url?: string; name?: string; mime?: string }
  | null
  | undefined

function strapiPublicOrigin(strapi: Core.Strapi): string {
  const configured = strapi.config.get("server.url") as string | undefined
  if (configured?.trim()) {
    return configured.replace(/\/$/, "")
  }
  const host = strapi.config.get("server.host") as string
  const port = strapi.config.get("server.port") as number
  const connectHost = host === "0.0.0.0" ? "127.0.0.1" : host
  return `http://${connectHost}:${port}`
}

function isHostnamePubliclyReachable(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, "").toLowerCase()
  if (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "::1" ||
    h === "0.0.0.0" ||
    h === "host.docker.internal"
  ) {
    return false
  }
  if (h.endsWith(".local")) {
    return false
  }
  if (/^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) {
    return false
  }
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) {
    return false
  }
  if (h.startsWith("fc") || h.startsWith("fd")) {
    return false
  }
  return true
}

function formatFalApiError(e: ApiError<unknown>): string {
  const body = e.body as { detail?: unknown; message?: string } | undefined
  const detail = body?.detail !== undefined ? JSON.stringify(body.detail) : ""
  const parts = [
    e.message,
    body?.message,
    detail,
    e.requestId ? `requestId=${e.requestId}` : "",
  ].filter(Boolean) as string[]
  return parts.join(" | ").slice(0, 12000)
}

function formatScheduledFalError(e: unknown): string {
  if (e instanceof ApiError) {
    return formatFalApiError(e)
  }
  return e instanceof Error ? e.message : String(e)
}

async function resolveSourceImageUrlForFal(
  strapi: Core.Strapi,
  sourceImage: SourceImageFields
): Promise<string | null> {
  const absolute = absoluteMediaUrl(strapi, sourceImage)
  if (!absolute) {
    return null
  }
  if (!absolute.startsWith("http")) {
    throw new Error(
      "Set APP_URL (server.url) so the source image has an absolute http(s) URL Strapi can read."
    )
  }
  let hostname: string
  try {
    hostname = new URL(absolute).hostname
  } catch {
    throw new Error("Invalid source image URL from Strapi media.")
  }
  if (isHostnamePubliclyReachable(hostname)) {
    return absolute
  }
  const res = await fetch(absolute)
  if (!res.ok) {
    throw new Error(
      `Could not read source image from Strapi at ${absolute} (HTTP ${res.status}).`
    )
  }
  const bytes = new Uint8Array(await res.arrayBuffer())
  const mime =
    res.headers.get("content-type")?.split(";")[0]?.trim() ||
    sourceImage?.mime ||
    "application/octet-stream"
  const rawName = sourceImage?.name?.replace(/[^\w.\-]+/g, "_") || "source.png"
  const name = rawName.includes(".") ? rawName : `${rawName}.png`
  return fal.storage.upload(
    new File([bytes], name, {
      type: mime,
    })
  )
}

function extractImageUrl(data: FalResultData): string | null {
  const images = data.images
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0]
    if (first && typeof first === "object" && "url" in first) {
      const u = (first as { url?: string }).url
      if (typeof u === "string") {
        return u
      }
    }
  }
  const image = data.image as { url?: string } | undefined
  if (image?.url) {
    return image.url
  }
  const output = data.output as { url?: string } | undefined
  if (output?.url) {
    return output.url
  }
  if (typeof data.url === "string") {
    return data.url
  }
  return null
}

function absoluteMediaUrl(
  strapi: Core.Strapi,
  file: { url?: string } | null | undefined
): string | null {
  if (!file?.url) {
    return null
  }
  if (file.url.startsWith("http")) {
    return file.url
  }
  const base = strapiPublicOrigin(strapi)
  const p = file.url.startsWith("/") ? file.url : `/${file.url}`
  return `${base}${p}`
}

/**
 * Resolves the Media Library folder id for fal uploads.
 * Folder name comes from the FAL AI singleton (`mediaUploadFolderName`), default `fal-history`.
 */
async function resolveFalUploadFolderId(
  strapi: Core.Strapi,
  folderNameFromSettings: string | null | undefined
): Promise<number | null> {
  const name = folderNameFromSettings?.trim() || "fal-history"
  const folder = await strapi.db.query(FOLDER_UID).findOne({
    where: { name },
  })
  if (!folder?.id) {
    strapi.log.warn(
      `[scheduled-fal-image] Media Library folder "${name}" not found; upload goes to the library default.`
    )
    return null
  }
  return folder.id
}

export default factories.createCoreService(UID, ({ strapi }) => ({
  async runGenerationIfDue() {
    return strapi.service(UID).runGeneration({ force: false })
  },

  async runGeneration(options: { force: boolean }) {
    const { force } = options
    const doc = await strapi.documents(UID).findFirst({
      populate: {
        sourceImage: true,
        outputImage: true,
      },
    })

    if (!doc) {
      strapi.log.warn(
        "[scheduled-fal-image] No singleton document yet. Create and save FAL AI in the admin."
      )
      return { ok: false, skipped: true, reason: "no_document" as const }
    }

    const documentId = doc.documentId

    if (!doc.enabled && !force) {
      return { ok: true, skipped: true, reason: "disabled" as const }
    }

    if (doc.lastJobStatus === "running" && doc.lastJobStartedAt) {
      const started = new Date(doc.lastJobStartedAt).getTime()
      if (Number.isFinite(started) && Date.now() - started < STALE_RUNNING_MS) {
        return { ok: true, skipped: true, reason: "already_running" as const }
      }
      strapi.log.warn(
        "[scheduled-fal-image] Resetting stale running state from a previous crash."
      )
      await strapi.documents(UID).update({
        documentId,
        data: {
          lastJobStatus: "error",
          lastError: "Previous run did not finish (stale running state).",
          lastJobStartedAt: null,
        },
      })
    }

    const minHours = doc.minIntervalHours ?? 48
    if (!force && doc.lastGeneratedAt) {
      const last = new Date(doc.lastGeneratedAt).getTime()
      if (Number.isFinite(last)) {
        const nextAllowed = last + minHours * 3600 * 1000
        if (Date.now() < nextAllowed) {
          return {
            ok: true,
            skipped: true,
            reason: "interval" as const,
            nextAllowedAt: new Date(nextAllowed).toISOString(),
          }
        }
      }
    }

    const falKey = process.env.FAL_KEY
    if (!falKey) {
      const msg = "FAL_KEY is not set"
      await strapi.documents(UID).update({
        documentId,
        data: { lastJobStatus: "error", lastError: msg },
      })
      return { ok: false, skipped: false, error: msg }
    }

    const modelId = doc.falModelId?.trim()
    const prompt = doc.prompt?.trim()
    if (!modelId || !prompt) {
      const msg = "falModelId and prompt must be set in FAL AI"
      await strapi.documents(UID).update({
        documentId,
        data: { lastJobStatus: "error", lastError: msg },
      })
      return { ok: false, skipped: false, error: msg }
    }

    await strapi.documents(UID).update({
      documentId,
      data: {
        lastJobStatus: "running",
        lastJobStartedAt: new Date(),
        lastError: null,
      },
    })

    try {
      fal.config({ credentials: falKey })

      const sourceImage = doc.sourceImage as SourceImageFields
      const imageUrlForFal = await resolveSourceImageUrlForFal(
        strapi,
        sourceImage
      )

      const input: Record<string, unknown> = {
        prompt,
        ...(imageUrlForFal ? { image_url: imageUrlForFal } : {}),
      }

      const result = await fal.subscribe(modelId, {
        input,
      })

      const data = (result?.data ?? {}) as FalResultData
      const imageUrl = extractImageUrl(data)
      if (!imageUrl) {
        throw new Error(
          "fal response did not contain a recognizable image URL (check model output shape)."
        )
      }

      const res = await fetch(imageUrl)
      if (!res.ok) {
        throw new Error(`Failed to download fal image: HTTP ${res.status}`)
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "fal-sch-"))
      const tmpPath = path.join(tmpDir, "out.png")
      await fs.writeFile(tmpPath, buffer)

      try {
        const stat = await fs.stat(tmpPath)
        const folderId = await resolveFalUploadFolderId(
          strapi,
          (doc as { mediaUploadFolderName?: string | null })
            .mediaUploadFolderName
        )
        const uploaded = (await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            data: folderId != null ? { fileInfo: { folder: folderId } } : {},
            files: {
              filepath: tmpPath,
              originalFilename: `fal-scheduled-${Date.now()}.png`,
              mimetype: "image/png",
              size: stat.size,
            },
          })) as { id?: number; documentId?: string }[]

        const file = Array.isArray(uploaded) ? uploaded[0] : uploaded
        if (!file?.id) {
          throw new Error("Upload did not return a file id")
        }

        await strapi.documents(UID).update({
          documentId,
          data: {
            outputImage: file.id,
            lastGeneratedAt: new Date(),
            lastJobStatus: "success",
            lastJobStartedAt: null,
            lastError: null,
          },
        })
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true })
      }

      strapi.log.info(
        "[scheduled-fal-image] Generation completed successfully."
      )
      return { ok: true, skipped: false as const }
    } catch (e) {
      const message = formatScheduledFalError(e)
      strapi.log.error(`[scheduled-fal-image] ${message}`)
      await strapi.documents(UID).update({
        documentId,
        data: {
          lastJobStatus: "error",
          lastJobStartedAt: null,
          lastError: message,
        },
      })
      return { ok: false, skipped: false, error: message }
    }
  },
}))
