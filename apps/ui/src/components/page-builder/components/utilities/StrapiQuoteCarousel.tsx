"use client"

import { useEffect, useState } from "react"

import type { Data } from "@repo/strapi-types"

import { pageBuilderBlockHeadingClass } from "@/components/page-builder/section-layout"
import { cn } from "@/lib/styles"

type QuoteCarouselVariant = "section" | "compact"

interface StrapiQuoteCarouselProps {
  readonly component:
    | Data.Component<"utilities.quote-carousel">
    | Data.Component<"sections.quote-carousel">
  readonly className?: string
  readonly title?: string
  /**
   * `section` = page-builder block: stacked text, border/shadow, dot indicators.
   * `compact` = narrow/footer use (default): existing min-height column layout.
   */
  readonly variant?: QuoteCarouselVariant
}

export function StrapiQuoteCarousel({
  component,
  className,
  title,
  variant = "compact",
}: StrapiQuoteCarouselProps) {
  const isSection = variant === "section"
  const quoteCount = component.quotes?.length ?? 0
  const showDots = isSection && quoteCount > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const currentQuote = component.quotes?.[currentIndex] || null

  useEffect(() => {
    const quotes = component.quotes
    if (!quotes?.length) return

    const calculateReadingTime = (text: string) => {
      const words = text.split(" ").length
      const readingSpeed = 300 // words per minute
      const baseTime = (words / readingSpeed) * 60 * 1000 // convert to ms
      const minTime = 4000 // minimum 4 seconds
      const maxTime = 20000 // maximum 20 seconds
      return Math.max(minTime, Math.min(maxTime, baseTime * 1.5)) // 1.5x reading time for contemplation
    }

    let timeoutId: NodeJS.Timeout

    const scheduleNext = () => {
      if (quotes.length <= 1) return

      const nextInterval = calculateReadingTime(
        quotes[currentIndex]?.text || ""
      )
      timeoutId = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % quotes.length)
          setIsVisible(true)
          scheduleNext()
        }, 500)
      }, nextInterval)
    }

    scheduleNext()

    return () => clearTimeout(timeoutId)
  }, [component.quotes, currentIndex])

  if (!currentQuote?.text) return null

  const bodyCol = isSection
    ? "flex flex-col gap-4 sm:gap-5"
    : "flex min-h-[150px] flex-col justify-between"

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h2 className={cn("mb-6 text-center sm:mb-8", pageBuilderBlockHeadingClass)}>
          {title}
        </h2>
      )}
      <div
        className={cn(
          bodyCol,
          isSection
            ? "rounded-xl border border-gray-200/90 bg-[var(--color-gray-100)] p-6 shadow-sm ring-1 ring-black/5 sm:p-8 dark:border-gray-200/80 dark:bg-white"
            : "rounded-lg p-6"
        )}
        style={
          isSection ? undefined : { backgroundColor: "var(--color-gray-100)" }
        }
        role="region"
        aria-label="Quote"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 transform opacity-0"
          )}
        >
          <p
            className={cn(
              "italic",
              isSection
                ? "text-base leading-relaxed text-gray-900 sm:text-lg"
                : undefined
            )}
          >
            &ldquo;{currentQuote.text}&rdquo;
          </p>
        </div>
        {currentQuote.author && (
          <div
            className={cn(
              "transition-all delay-100 duration-500 ease-in-out",
              isVisible
                ? "translate-y-0 transform opacity-100"
                : "translate-y-2 transform opacity-0"
            )}
          >
            <p
              className={cn(
                "text-right",
                isSection
                  ? "text-sm font-semibold text-gray-900 sm:text-base"
                  : "font-medium"
              )}
            >
              &mdash; {currentQuote.author}
            </p>
          </div>
        )}
        {showDots && (
          <div
            className="mt-1 flex items-center justify-center gap-1.5 pt-4"
            aria-hidden="true"
          >
            {component.quotes?.map((q, i) => (
              <span
                key={q.id != null ? String(q.id) : `dot-${i}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentIndex
                    ? "w-6 bg-red-600"
                    : "w-1.5 bg-gray-300 dark:bg-gray-200"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StrapiQuoteCarousel
