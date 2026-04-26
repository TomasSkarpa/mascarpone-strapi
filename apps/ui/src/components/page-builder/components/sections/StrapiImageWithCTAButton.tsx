import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { getStrapiLinkHref } from "@/components/page-builder/components/utilities/StrapiLink"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"

export const StrapiImageWithCTAButton = ({
  component,
}: {
  readonly component: Data.Component<"sections.image-with-cta-button">
}) => {
  const ctaHref = getStrapiLinkHref(component.link)
  const ctaLabel = component.link?.label
  return (
    <section className="text-gray-950 dark:text-gray-950">
      <Container
        className={cn(
          "items-center gap-4 md:grid md:grid-cols-2 md:gap-8 xl:gap-8",
          pageBuilderSectionY
        )}
      >
        <div className="flex justify-center">
          <StrapiBasicImage
            component={component.image}
            className="w-full object-contain object-center"
            hideWhenMissing
            forcedSizes={{ height: 300 }}
          />
        </div>

        <div className="md:mt-0">
          <h2
            className={cn(
              "mb-4 text-left sm:text-balance",
              pageBuilderSectionTitleClass,
              "!text-gray-950 dark:!text-gray-950"
            )}
          >
            {component.title}
          </h2>
          {component.subText && (
            <p
              className={cn(
                "mb-6 max-w-2xl text-left text-base font-normal sm:text-lg sm:text-balance",
                "!text-gray-800",
                "dark:!text-gray-800"
              )}
            >
              {component.subText}
            </p>
          )}

          {ctaHref && ctaLabel ? (
            <AppLink
              href={ctaHref}
              openInNewTab={Boolean(component.link?.newTab)}
              variant="default"
              className="inline-flex !min-h-12 !text-white !no-underline"
            >
              {ctaLabel}
            </AppLink>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

StrapiImageWithCTAButton.displayName = "StrapiImageWithCTAButton"

export default StrapiImageWithCTAButton
