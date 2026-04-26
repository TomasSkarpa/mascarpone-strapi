"use client"

import { usePathname } from "@/lib/navigation"
import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"

export default function DevNavbar() {
  const pathname = usePathname()
  const links = [
    {
      href: "/dev/pages-overview",
      label: "Pages overview",
    },
    {
      href: "/dev/components-overview",
      label: "Components overview",
    },
  ]
  return (
    <div className="bg-gray-300">
      <Container>
        <div className="py-2">
          {links
            .filter((link) => link.href !== pathname)
            .map((link) => (
              <AppLink
                key={link.href}
                href={link.href}
                plain
                className={cn(
                  "inline-flex rounded-md px-3 py-1.5 text-sm font-medium",
                  "text-gray-900 no-underline hover:bg-black/5 hover:text-gray-950",
                  "dark:!text-gray-900 dark:hover:!text-gray-950"
                )}
              >
                {link.label}
              </AppLink>
            ))}
        </div>
      </Container>
    </div>
  )
}
