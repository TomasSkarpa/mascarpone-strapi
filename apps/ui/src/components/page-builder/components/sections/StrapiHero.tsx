import { Check } from "lucide-react"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  pageBuilderPageTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import { Typography } from "@/components/typography"
import { cn } from "@/lib/styles"

export function StrapiHero({
  component,
}: {
  readonly component: Data.Component<"sections.hero">
}) {
  const bgColor = component.bgColor?.trim() || undefined
  return (
    <section
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <Container
        className={cn(
          "flex flex-col gap-8 md:flex-row md:items-center md:gap-10 lg:gap-14",
          pageBuilderSectionY
        )}
      >
        <div
          className={`flex w-full flex-col justify-center ${
            component.image?.media ? "md:w-1/2" : "md:w-full"
          }`}
        >
          <h1
            className={cn(
              "mb-4 max-w-2xl text-left sm:mb-5 md:text-center",
              pageBuilderPageTitleClass
            )}
          >
            {component.title}
          </h1>
          {component.subTitle && (
            <Typography
              tag="p"
              variant="large"
              className="mb-6 max-w-2xl text-left text-base text-gray-800 md:text-center md:text-lg"
            >
              {component.subTitle}
            </Typography>
          )}
          {component?.steps &&
            component?.steps?.length > 0 &&
            component.steps.map((step) => (
              <div key={step.id} className="flex items-center gap-1 py-2">
                <Check className="text-primary-500" />
                <Typography>{step.text}</Typography>
              </div>
            ))}

          {component.links && (
            <div className="flex flex-col gap-2 pt-4 lg:flex-row lg:gap-4">
              {component.links.map((link, i) => (
                <StrapiLink
                  key={i}
                  component={link}
                  appLinkVariant="default"
                  className="inline-flex !min-h-12 !no-underline"
                />
              ))}
            </div>
          )}
        </div>

        {component.image?.media && (
          <div
            className={`hidden md:col-span-6 md:mt-0 md:flex ${
              component.imageAlignment === "right"
                ? "justify-end"
                : component.imageAlignment === "left"
                  ? "justify-start"
                  : "justify-center"
            }`}
          >
            <StrapiBasicImage
              component={component.image}
              className="rounded-lg object-contain"
              forcedSizes={{ height: 500 }}
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiHero.displayName = "StrapiHero"

export default StrapiHero
