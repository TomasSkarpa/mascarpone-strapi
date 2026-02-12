import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import { getStrapiLinkHref } from "@/components/page-builder/components/utilities/StrapiLink"

interface StrapiNavLinkProps {
  readonly component: Data.Component<"utilities.link">
  readonly className?: string
}

export function StrapiNavLink({ component, className }: StrapiNavLinkProps) {
  const href = getStrapiLinkHref(component)
  if (!href || href === "#" || !component?.label) {
    return null
  }

  return (
    <AppLink
      href={href}
      variant="ghost"
      className={cn(
        "mx-2 rounded-lg px-3 py-2 text-base font-normal transition-colors duration-200",
        "text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-red)]",
        "focus:bg-gray-100 focus:text-[var(--color-brand-red)] focus:outline-none",
        className
      )}
    >
      {component.label}
    </AppLink>
  )
}

export default StrapiNavLink
