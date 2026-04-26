import { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ContactForm } from "@/components/elementary/forms/ContactForm"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import { Typography } from "@/components/typography"
import { cn } from "@/lib/styles"

export function StrapiContactForm({
  component,
}: {
  readonly component: Data.Component<"forms.contact-form">
}) {
  return (
    <section className="bg-gray-100" id="form-section">
      <Container
        className={cn(
          "flex flex-col gap-10 sm:gap-12 lg:flex-row lg:gap-20",
          pageBuilderSectionY
        )}
      >
        <div className="flex min-w-0 flex-1">
          <div className="flex max-w-[480px] flex-col gap-6 sm:gap-8">
            {component.title && (
              <h2
                className={cn("text-balance", pageBuilderSectionTitleClass)}
              >
                {component.title}
              </h2>
            )}
            {component.description && (
              <Typography className="leading-relaxed text-gray-800">
                {component.description}
              </Typography>
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-1">
          <div className="w-full max-w-lg">
            <ContactForm
              gdpr={{
                href: component.gdpr?.href ?? undefined,
                label: component.gdpr?.label ?? undefined,
                newTab: component.gdpr?.newTab ?? false,
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
