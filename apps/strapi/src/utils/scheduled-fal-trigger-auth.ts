import jwt from "jsonwebtoken"

import type { Core } from "@strapi/strapi"

type Headers = Record<string, string | string[] | undefined>

/**
 * Validates callers of the FAL AI manual trigger endpoint.
 * Accepts: `x-fal-scheduled-image-trigger-secret` when it matches
 * `FAL_SCHEDULED_IMAGE_TRIGGER_SECRET`, or a Strapi admin JWT in `Authorization: Bearer`.
 */
export function isScheduledFalTriggerAuthorized(
  strapi: Core.Strapi,
  headers: Headers
): boolean {
  const triggerSecret = process.env.FAL_SCHEDULED_IMAGE_TRIGGER_SECRET
  const headerVal = headers["x-fal-scheduled-image-trigger-secret"]
  const headerSecret =
    typeof headerVal === "string"
      ? headerVal
      : Array.isArray(headerVal)
        ? headerVal[0]
        : undefined
  if (triggerSecret && headerSecret === triggerSecret) {
    return true
  }

  const authHeader = headers.authorization
  const authStr = typeof authHeader === "string" ? authHeader : authHeader?.[0]
  const bearer = authStr?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!bearer) {
    return false
  }

  try {
    const decoded = jwt.verify(bearer, strapi.config.get("admin.auth.secret"))
    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      return true
    }
  } catch {
    return false
  }

  return false
}
