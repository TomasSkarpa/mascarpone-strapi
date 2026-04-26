import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import StrapiQuoteCarousel from "@/components/page-builder/components/utilities/StrapiQuoteCarousel"
import { pageBuilderSectionY } from "@/components/page-builder/section-layout"

export function StrapiQuoteCarouselSection({
  component,
}: {
  readonly component: Data.Component<"sections.quote-carousel">
}) {
  return (
    <section aria-label="Quote">
      <Container className={pageBuilderSectionY}>
        <div className="mx-auto w-full max-w-4xl">
          <StrapiQuoteCarousel component={component} variant="section" />
        </div>
      </Container>
    </section>
  )
}

StrapiQuoteCarouselSection.displayName = "StrapiQuoteCarouselSection"

export default StrapiQuoteCarouselSection
