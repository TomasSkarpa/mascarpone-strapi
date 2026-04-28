import { Data } from "@repo/strapi-types"

import type { StrapiImageMedia } from "@/types/api"

import { PublicStrapiClient } from "@/lib/strapi-api"
import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"

export async function StrapiScheduledFalOutput({
  component,
}: {
  readonly component: Data.Component<"sections.scheduled-fal-output">
}) {
  let media: StrapiImageMedia | undefined
  let statusMessage: string | null = null

  try {
    const res = await PublicStrapiClient.fetchOne(
      "api::scheduled-fal-image.scheduled-fal-image",
      undefined,
      {
        populate: { outputImage: true },
      },
      undefined,
      { doNotAddLocaleQueryParams: true }
    )
    const raw = res.data?.outputImage
    if (raw && typeof raw === "object" && "url" in raw) {
      media = raw as StrapiImageMedia
    }
    if (
      !media?.url &&
      res.data?.lastJobStatus === "error" &&
      res.data?.lastError
    ) {
      statusMessage = res.data.lastError
    }
  } catch {
    statusMessage = "FAL AI content could not be loaded."
  }

  return (
    <section className="text-gray-950 dark:text-gray-950">
      <Container className={cn("flex flex-col gap-6", pageBuilderSectionY)}>
        {component.title ? (
          <h2
            className={cn(
              pageBuilderSectionTitleClass,
              "!text-gray-950 dark:!text-gray-950"
            )}
          >
            {component.title}
          </h2>
        ) : null}
        {component.description ? (
          <p className="max-w-2xl text-base text-gray-800 dark:text-gray-800">
            {component.description}
          </p>
        ) : null}
        <StrapiBasicImage
          component={
            media?.url
              ? ({
                  __component: "utilities.basic-image",
                  id: 0,
                  alt: component.title ?? "Generated image",
                  media,
                } as Data.Component<"utilities.basic-image">)
              : undefined
          }
          className="w-full max-w-3xl object-contain object-center"
          hideWhenMissing
          forcedSizes={{ height: 400 }}
        />
        {statusMessage && !media?.url ? (
          <p className="text-sm text-gray-600 dark:text-gray-600" role="status">
            {statusMessage}
          </p>
        ) : null}
      </Container>
    </section>
  )
}

StrapiScheduledFalOutput.displayName = "StrapiScheduledFalOutput"

export default StrapiScheduledFalOutput
