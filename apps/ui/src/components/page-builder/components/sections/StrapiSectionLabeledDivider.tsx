import React from "react"
import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"

/**
 * Centered overline: short rule on large viewports, full width on small screens, with a pill label
 * that matches the default page background (body `bg-gray-100`).
 */
export function StrapiSectionLabeledDivider({
  component,
}: {
  readonly component: Data.Component<"sections.section-labeled-divider">
}) {
  return (
    <div className="w-full">
      <Container className="py-6 sm:py-7 lg:py-8">
        <div className="relative flex w-full items-center justify-center">
          <div
            className="h-px w-full max-w-md bg-gray-200 dark:bg-gray-300/80"
            aria-hidden
          />
          <p
            className={cn(
              "absolute top-1/2 left-1/2 z-10 max-w-[min(90vw,22rem)] -translate-x-1/2 -translate-y-1/2 text-balance",
              "rounded-lg border border-gray-200/90 bg-gray-100 px-3 py-1",
              "text-center text-xs font-medium tracking-wide text-gray-600 uppercase",
              "sm:text-sm",
              "dark:border-gray-600/50 dark:bg-gray-100 dark:text-gray-600"
            )}
          >
            {component.label}
          </p>
        </div>
      </Container>
    </div>
  )
}

StrapiSectionLabeledDivider.displayName = "StrapiSectionLabeledDivider"

export default StrapiSectionLabeledDivider
