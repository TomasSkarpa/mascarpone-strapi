import { Data } from "@repo/strapi-types"

import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import { NewsletterForm } from "@/components/elementary/forms/NewsletterForm"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import { cn } from "@/lib/styles"

export function StrapiNewsletterForm({
  component,
}: {
  readonly component: Data.Component<"forms.newsletter-form">
}) {
  return (
    <section className="bg-blue-light">
      <Container
        className={cn(
          "flex flex-col justify-between gap-y-10 sm:gap-y-12 lg:flex-row",
          pageBuilderSectionY
        )}
      >
        <div className="flex w-full max-w-[510px] flex-1 flex-col gap-6 sm:gap-8">
          <h2 className={cn("text-balance", pageBuilderSectionTitleClass)}>
            {component.title}
          </h2>
          {component.description && (
            <p className="text-balance text-gray-700">{component.description}</p>
          )}
        </div>
        <div className="flex w-full max-w-[560px] flex-1 items-end self-stretch lg:items-end">
          <div className="mt-1 flex w-full flex-col gap-1">
            <NewsletterForm />
            <div className="mt-2 flex items-center">
              {component.gdpr?.href && (
                <AppLink
                  openInNewTab={Boolean(component.gdpr.newTab)}
                  className="text-blue-700 underline"
                  href={component.gdpr.href}
                >
                  {component.gdpr.label}
                </AppLink>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiNewsletterForm.displayName = "StrapiNewsletterForm"

export default StrapiNewsletterForm
