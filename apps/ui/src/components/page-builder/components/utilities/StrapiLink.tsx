import React from "react"
import { Data } from "@repo/strapi-types"

import AppLink from "@/components/elementary/AppLink"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export interface StrapiLinkProps {
  readonly component: Data.Component<"utilities.link"> | undefined | null
  readonly children?: React.ReactNode
  readonly className?: string
  readonly hideWhenMissing?: boolean
}

/** Picks fullPath from page relation (flat or REST nested shape). */
function getPageFullPath(page: unknown): string | undefined {
  if (!page || typeof page !== "object") return undefined
  const p = page as Record<string, unknown>
  if (typeof p.fullPath === "string") return p.fullPath
  const attrs = p.attributes ?? (p.data as Record<string, unknown>)?.attributes
  if (attrs && typeof (attrs as Record<string, unknown>).fullPath === "string")
    return (attrs as Record<string, unknown>).fullPath as string
  return undefined
}

/**
 * Resolves href for a Strapi link component (page → fullPath, external → href).
 * Falls back to page.fullPath or href when type is missing (API can omit it).
 */
export function getStrapiLinkHref(
  component?: Data.Component<"utilities.link"> | null
): string | undefined {
  if (!component) return undefined
  const type = component.type
  const pagePath = getPageFullPath((component as Record<string, unknown>).page)
  if (type === "external" && component.href) return component.href
  if (type === "page" && pagePath) return pagePath
  if (type === "page") return "#"
  // Resilient fallback when type is missing or unexpected
  if (pagePath) return pagePath
  if (component.href) return component.href
  return undefined
}

export function StrapiLink({
  component,
  children,
  className,
  hideWhenMissing,
}: StrapiLinkProps) {
  if (component == null && hideWhenMissing) {
    return null
  }

  const { newTab = false, label, decorations } = component ?? {}

  const {
    variant = "link",
    size = "default",
    leftIcon,
    rightIcon,
    hasIcons = false,
  } = decorations ?? {}

  const linkHref = getStrapiLinkHref(component) ?? undefined

  if (!linkHref) {
    return children ?? label ?? null
  }

  return (
    <AppLink
      href={linkHref}
      openInNewTab={newTab ?? false}
      className={className}
      startAdornment={
        hasIcons && leftIcon ? (
          <StrapiBasicImage component={leftIcon} fill />
        ) : undefined
      }
      endAdornment={
        hasIcons && rightIcon ? (
          <StrapiBasicImage component={rightIcon} fill />
        ) : undefined
      }
      variant={variant}
      size={size}
    >
      {children ?? label}
    </AppLink>
  )
}

StrapiLink.displayName = "StrapiLink"

export default StrapiLink
