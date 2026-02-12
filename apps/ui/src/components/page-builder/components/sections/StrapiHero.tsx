import { Data } from "@repo/strapi-types"
import { Check } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { Typography } from "@/components/typography"

export function StrapiHero({
  component,
}: {
  readonly component: Data.Component<"sections.hero">
}) {
  return (
    <section style={{ backgroundColor: component.bgColor ?? "transparent" }}>
      <Container className="flex flex-col gap-6 px-4 py-8 md:flex-row lg:py-12 xl:gap-0">
        <div
          className={`flex w-full flex-col justify-center ${
            component.image?.media ? "md:w-1/2" : "md:w-full"
          }`}
        >
          <Typography
            tag="h1"
            variant="heading1"
            className="max-w-2xl text-left text-2xl font-bold text-gray-900 md:text-center md:text-4xl lg:text-5xl"
          >
            {component.title}
          </Typography>
          {component.subTitle && (
            <Paragraph className="mb-6 max-w-2xl text-left text-base text-gray-600 md:text-center md:text-lg">
              {component.subTitle}
            </Paragraph>
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
                  className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-400 focus:outline-none lg:w-fit"
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
