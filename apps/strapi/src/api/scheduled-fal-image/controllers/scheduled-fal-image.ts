/**
 * scheduled-fal-image controller
 */

import { factories } from "@strapi/strapi"

import { isScheduledFalTriggerAuthorized } from "../../../utils/scheduled-fal-trigger-auth"

export default factories.createCoreController(
  "api::scheduled-fal-image.scheduled-fal-image",
  ({ strapi }) => ({
    async run(ctx) {
      if (
        !isScheduledFalTriggerAuthorized(
          strapi,
          ctx.request.headers as Record<string, string | string[] | undefined>
        )
      ) {
        return ctx.forbidden("Not authorized to run FAL AI generation")
      }

      const force =
        ctx.request.body &&
        typeof ctx.request.body === "object" &&
        (ctx.request.body as { force?: boolean }).force === true

      const result = await strapi
        .service("api::scheduled-fal-image.scheduled-fal-image")
        .runGeneration({ force })

      ctx.body = result
    },
  })
)
