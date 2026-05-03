import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { pageBuilderSectionY } from "@/components/page-builder/section-layout"

export function StrapiCommendationsPanel({
  component,
}: {
  readonly component: Data.Component<"sections.commendations-panel">
}) {
  const items = component.items?.filter(Boolean) ?? []

  if (items.length === 0) {
    return null
  }

  return (
    <section
      aria-label={component.sectionLabel ?? undefined}
      className="bg-neutral-50 text-gray-900 dark:bg-neutral-50 dark:text-gray-900"
    >
      <Container className={cn(pageBuilderSectionY)}>
        <div className="relative mx-auto mb-10 flex w-full max-w-3xl items-center justify-center sm:mb-12 lg:mb-14">
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
            {component.sectionLabel}
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl list-none gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-14 lg:gap-x-16">
          {items.map((item) => {
            const attributionMeta = [item.roleTitle, item.company]
              .filter(Boolean)
              .join(" ~ ")

            return (
              <li key={item.id} className="flex flex-col">
                <span
                  className="mb-3 font-serif text-5xl leading-none font-bold text-gray-900 select-none sm:text-6xl"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="mb-6 flex-1 text-base leading-relaxed font-normal text-pretty text-gray-700 sm:text-[1.05rem]">
                  {item.text}
                </blockquote>
                <footer className="flex items-center gap-3 border-t border-gray-200/90 pt-5 dark:border-gray-300/80">
                  {item.avatar ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-gray-200 ring-1 ring-gray-200/80">
                      <StrapiBasicImage
                        component={item.avatar}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                        hideWhenMissing
                        fallbackSizes={{ width: 48, height: 48 }}
                        forcedSizes={{ width: 48, height: 48 }}
                        format="thumbnail"
                      />
                    </div>
                  ) : (
                    <div
                      className="size-12 shrink-0 rounded-full bg-gray-200 ring-1 ring-gray-200/80 dark:bg-gray-300"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 sm:text-base">
                      {item.authorEmoji ? (
                        <span className="mr-1.5" aria-hidden>
                          {item.authorEmoji}
                        </span>
                      ) : null}
                      {item.authorName}
                    </p>
                    {attributionMeta ? (
                      <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                        {attributionMeta}
                      </p>
                    ) : null}
                  </div>
                </footer>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}

StrapiCommendationsPanel.displayName = "StrapiCommendationsPanel"

export default StrapiCommendationsPanel
