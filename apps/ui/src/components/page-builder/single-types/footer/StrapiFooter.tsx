import { use } from "react"
import { Locale } from "next-intl"

import { fetchFooter } from "@/lib/strapi-api/content/server"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import StrapiQuoteCarousel from "@/components/page-builder/components/utilities/StrapiQuoteCarousel"
import StrapiSocialIcon from "@/components/page-builder/components/utilities/StrapiSocialIcon"

export function StrapiFooter({ locale }: { readonly locale: Locale }) {
  const response = use(fetchFooter(locale))
  const component = response?.data

  if (!component) return null

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-900 dark:bg-white">
      <Container className="px-4 py-12 md:px-6 lg:py-16">
        <div className="space-y-12">
          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
            {/* Brand Section */}
            <div className="space-y-6">
              {component.quoteCarousel && (
                <StrapiQuoteCarousel
                  component={component.quoteCarousel}
                  className="max-w-md"
                />
              )}

              {Boolean(component.socialIcons?.length) && (
                <div className="flex items-center gap-4">
                  {component.socialIcons?.map((socialIcon) => (
                    <StrapiSocialIcon
                      key={socialIcon.id}
                      component={socialIcon}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Sections */}
            {Boolean(component.sections?.length) && (
              <div
                className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-${Math.min(component.sections?.length ?? 0, 4)}`}
              >
                {component.sections?.slice(0, 4).map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-900">
                      {section.title}
                    </h3>
                    <nav className="space-y-3">
                      {section.links?.map((link, i) => (
                        <StrapiLink
                          key={`${link.id}-${i}`}
                          component={link}
                          className="block text-sm !text-gray-900 no-underline transition-colors duration-200 hover:!text-gray-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-2 dark:!text-gray-900 dark:hover:!text-gray-800"
                        />
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {component.copyRight && (
                <div className="text-sm text-gray-600 dark:text-gray-600">
                  {component.includeYear
                    ? `© ${new Date().getFullYear()} ${component.copyRight}`
                    : component.copyRight}
                </div>
              )}
            </div>

            {Boolean(component.links?.length) && (
              <nav className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-6">
                {component.links?.map((link, i) => (
                  <StrapiLink
                    key={`${link.id}-${i}`}
                    component={link}
                    className="w-full !items-start !justify-start py-2 text-left text-sm !text-gray-900 no-underline transition-colors duration-200 hover:text-gray-800 hover:underline focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-2 md:w-auto md:py-0 dark:!text-gray-900 dark:hover:text-gray-800"
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default StrapiFooter
