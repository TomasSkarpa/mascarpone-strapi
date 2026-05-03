import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"

function initialsFromDisplayName(name: string): string {
  const segments = name.match(/\p{L}+/gu)
  if (segments == null || segments.length === 0) {
    return "?"
  }
  if (segments.length === 1) {
    const s = segments[0] ?? ""
    const a = s[0]
    const b = s[1] ?? s[0]
    if (a == null || b == null) {
      return "?"
    }
    return (a + b).toUpperCase()
  }
  const firstWord = segments[0] ?? ""
  const lastWord = segments[segments.length - 1] ?? ""
  const c0 = firstWord[0]
  const c1 = lastWord[0]
  if (c0 == null || c1 == null) {
    return "?"
  }
  return (c0 + c1).toUpperCase()
}

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
    <section aria-label={component.sectionLabel ?? undefined}>
      <Container
        className={cn(
          pageBuilderSectionY,
          "text-gray-900 dark:text-gray-900"
        )}
      >
        <h2
          className={cn(
            "mx-auto mb-5 max-w-3xl text-center text-balance sm:mb-6",
            pageBuilderSectionTitleClass,
            "!text-gray-900 dark:!text-gray-900"
          )}
        >
          {component.sectionLabel}
        </h2>

        <ul className="mx-auto grid max-w-6xl list-none gap-6 sm:gap-8 md:grid-cols-2">
          {items.map((item) => {
            const attributionMeta = [item.roleTitle, item.company]
              .filter(Boolean)
              .join(", ")
            const initials = initialsFromDisplayName(item.authorName ?? "")

            return (
              <li key={item.id} className="flex min-h-0">
                <article className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-7 sm:p-8">
                  <span
                    className="font-sans text-5xl leading-none font-normal text-gray-300 select-none sm:text-6xl"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mb-8 flex-1 text-pretty text-base leading-relaxed font-normal text-gray-900 sm:text-[1.05rem]">
                    {item.text}
                  </blockquote>
                  <footer className="mt-auto flex items-center gap-3">
                    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-[0.7rem] font-semibold tracking-tight text-white uppercase">
                      <span className="pointer-events-none select-none" aria-hidden>
                        {initials}
                      </span>
                      {item.avatar ? (
                        <StrapiBasicImage
                          component={item.avatar}
                          width={48}
                          height={48}
                          className="absolute inset-0 size-full object-cover"
                          hideWhenMissing
                          fallbackSizes={{ width: 48, height: 48 }}
                          forcedSizes={{ width: 48, height: 48 }}
                          format="thumbnail"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 sm:text-base">
                        {item.authorEmoji ? (
                          <span className="mr-1.5 font-normal" aria-hidden>
                            {item.authorEmoji}
                          </span>
                        ) : null}
                        {item.authorName}
                      </p>
                      {attributionMeta ? (
                        <p className="mt-0.5 text-xs leading-snug text-gray-600 sm:text-sm">
                          {attributionMeta}
                        </p>
                      ) : null}
                    </div>
                  </footer>
                </article>
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
