/**
 * Shared motion tokens. Source of truth: CSS custom properties in `src/styles/globals.css` (`:root`).
 * Use these for inline `style` or to mirror timing in JS; prefer CSS variables in classes when possible.
 */
export const appMotion = {
  /** Radix accordion height, FAQ expand/collapse */
  ease: "var(--app-motion-ease)",
  collapseDuration: "var(--app-motion-collapse-duration)",
  /** Select / small overlays (e.g. locale switcher) */
  dropdownDuration: "var(--app-motion-dropdown-duration)",
} as const

/**
 * Reusable `className` bits that reference the same variables as the globals.
 */
export const appMotionClassNames = {
  accordionContent: "app-accordion-content",
  selectDropdown: "app-dropdown-motion",
} as const
