import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { Typography } from "@/components/typography"

export function StrapiAnimatedLogoRow({
  component,
}: {
  readonly component: Data.Component<"sections.animated-logo-row">
}) {
  const logos = component.logos?.filter((l) => l != null) ?? []
  const hasHeading = Boolean(component.text?.trim())
  if (logos.length === 0 && !hasHeading) {
    return null
  }

  const sliderImages = [...logos, ...logos]

  return (
    <section className="w-full py-5">
      <div className="flex flex-col items-center gap-[30px]">
        {hasHeading && (
          <Typography tag="h3" variant="heading4" fontWeight="normal">
            {component.text}
          </Typography>
        )}

        {logos.length > 0 && (
          <div className="relative mt-4 w-full">
            <div className="infinite-scroll-container-horizontal w-full">
              <div
                className={cn(
                  "infinite-scroll-horizontal flex gap-14 overflow-hidden",
                  logos.length > 10 && "justify-center"
                )}
              >
                {sliderImages.map((logo, index) => (
                  <div key={String(logo.id) + index}>
                    <StrapiBasicImage
                      component={logo}
                      forcedSizes={{ width: 200 }}
                      priority={index < 10}
                      loading="eager"
                      className="z-10 max-h-10 w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 size-full opacity-80" />
          </div>
        )}
      </div>
    </section>
  )
}

StrapiAnimatedLogoRow.displayName = "StrapiAnimatedLogoRow"

export default StrapiAnimatedLogoRow
