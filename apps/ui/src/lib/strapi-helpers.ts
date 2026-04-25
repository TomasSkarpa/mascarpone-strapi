import type { StaticImport } from "next/dist/shared/lib/get-img-props"

import { getEnvVar } from "@/lib/env-vars"

/**
 * Function to format Strapi media URLs. There are 2 types of upload:
 * - S3 bucket - in this case, the URL is already correct and starts with https
 * - local upload - in this case, the URL starts with /uploads and we need to add API url prefix
 * (this happens in route handler for Strapi assets)
 *
 * TODO: make this generic - return same type as argument has
 */
export const formatStrapiMediaUrl = (
  imageUrl: string | StaticImport | undefined | null
): any => {
  if (!imageUrl) {
    return "/image-placeholder.svg"
  }

  if (typeof imageUrl === "string") {
    if (!imageUrl.startsWith("http")) {
      if (imageUrl.startsWith("/uploads")) {
        // Local upload - add BE URL prefix
        return typeof window === "undefined"
          ? formatServerUrl(imageUrl)
          : formatClientUrl(imageUrl)
      }
    }
  }

  // S3 upload or already formatted URL - return as is
  return imageUrl
}

const formatClientUrl = (imageUrl: string): string => {
  return `/api/asset${imageUrl}`
}

/**
 * Resolves a Strapi media `url` to an address the browser can fetch, without
 * `NEXT_PUBLIC_STRAPI_URL` or a localhost default. Relative paths (e.g. /uploads/…)
 * go through the same `/api/asset` handler as `formatStrapiMediaUrl` on the client.
 */
export function getClientStrapiFileUrl(
  fileUrl: string | undefined | null
): string | null {
  if (!fileUrl) {
    return null
  }
  if (fileUrl.startsWith("http")) {
    return fileUrl
  }
  return `/api/asset${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`
}

const formatServerUrl = (imageUrl: string): string => {
  return `${getEnvVar("STRAPI_URL")}${imageUrl}`
}
