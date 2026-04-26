import { cn } from "@/lib/styles"

/**
 * Shared layout tokens for Strapi page-builder blocks (stacked dynamic zone sections).
 * Keeps vertical rhythm and title scale aligned on desktop and mobile.
 */
export const pageBuilderSectionY = "py-12 sm:py-16 lg:py-20" as const

/**
 * Shared heading “character” (weight, color, tracking) for page builder.
 * Size is added in `pageBuilderPageTitleClass` / `pageBuilderSectionTitleClass` / `pageBuilderBlockHeadingClass`.
 */
export const pageBuilderHeadingBase =
  "font-bold tracking-tight text-gray-900 dark:text-gray-900" as const

/** H1: page / hero / lead title — one step up from section H2 */
export const pageBuilderPageTitleClass = cn(
  pageBuilderHeadingBase,
  "text-3xl sm:text-5xl lg:text-6xl"
)

/** Main section H2 (FAQs, gallery, forms, tip-tap H2, etc.) */
export const pageBuilderSectionTitleClass = cn(
  pageBuilderHeadingBase,
  "text-2xl sm:text-4xl lg:text-5xl"
)

/** Smaller H2 (e.g. optional quote block title) */
export const pageBuilderBlockHeadingClass = cn(
  pageBuilderHeadingBase,
  "text-2xl sm:text-3xl"
)

/** Section intro / subtitle copy — strong contrast on default page `bg-gray-100` in both themes. */
export const pageBuilderSectionIntroClass =
  "mx-auto max-w-2xl text-base text-gray-800 sm:text-lg" as const

/** Class names for a centered “eyebrow” (hairlines + small caps label) — use with `globals` `.portfolio-eyebrow` + `.portfolio-eyebrow__label` */
export const pageBuilderSectionEyebrowClass =
  "portfolio-eyebrow mb-4 sm:mb-5" as const
