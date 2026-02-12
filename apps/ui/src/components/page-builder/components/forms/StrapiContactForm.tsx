import { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ContactForm } from "@/components/elementary/forms/ContactForm"
import { Typography } from "@/components/typography"

export function StrapiContactForm({
  component,
}: {
  readonly component: Data.Component<"forms.contact-form">
}) {
  return (
    <div className="bg-gray-100" id="form-section">
      <Container className="flex flex-col gap-12 py-16 lg:flex-row lg:gap-20 lg:py-24">
        <div className="flex flex-1">
          <div className="flex max-w-[480px] flex-col gap-8">
            {component.title && (
              <Typography variant="heading3" tag="h3" className="text-gray-900">
                {component.title}
              </Typography>
            )}
            {component.description && (
              <Typography className="leading-relaxed text-gray-600">
                {component.description}
              </Typography>
            )}
          </div>
        </div>
        <div className="flex flex-1">
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
    </div>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
