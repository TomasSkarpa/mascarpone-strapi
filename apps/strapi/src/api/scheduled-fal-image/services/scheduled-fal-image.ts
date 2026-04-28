/**
 * scheduled-fal-image service: fal Model API calls and Strapi media updates.
 */

import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { factories } from "@strapi/strapi"
import { fal } from "@fal-ai/client"

import type { Core } from "@strapi/strapi"

const UID = "api::scheduled-fal-image.scheduled-fal-image" as const
const FOLDER_UID = "plugin::upload.folder" as const

const STALE_RUNNING_MS = 45 * 60 * 1000

type FalResultData = Record<string, unknown>

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
  const base = (strapi.config.get("server.url") as string | undefined) ?? ""
  const trimmed = base.replace(/\/$/, "")
  const p = file.url.startsWith("/") ? file.url : `/${file.url}`
  return `${trimmed}${p}`
}

function mergeExtraJson(raw: unknown): Record<string, unknown> {
  if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
    return { ...(raw as Record<string, unknown>) }
  }
  return {}
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

    const sourceUrl = absoluteMediaUrl(
      strapi,
      doc.sourceImage as { url?: string } | null | undefined
    )

    const input: Record<string, unknown> = {
      prompt,
      ...(sourceUrl ? { image_url: sourceUrl } : {}),
      ...mergeExtraJson(doc.extraInputJson),
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
      const message = e instanceof Error ? e.message : String(e)
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
