"use client"

import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import Typography from "@/components/typography"

export default function PageList({ pages }: { pages: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      {pages?.map((page) => (
        <div key={page.id}>
          <Typography variant="large">{page.title}</Typography>
          <AppLink
            href={page.fullPath ?? ""}
            openInNewTab
            plain
            className={cn(
              "mb-2 block font-mono text-sm",
              "text-gray-800 hover:text-gray-950",
              "underline-offset-2 hover:underline",
              "dark:!text-gray-800 dark:hover:!text-gray-950"
            )}
          >
            {page.fullPath}
          </AppLink>
        </div>
      ))}
    </div>
  )
}
