"use client"

import AppLink from "@/components/elementary/AppLink"
import Typography from "@/components/typography"

export default function PageList({ pages }: { pages: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      {pages?.map((page) => (
        <div key={page.id}>
          <Typography variant="large">{page.title}</Typography>
          <AppLink href={page.fullPath ?? ""} openInNewTab className="mb-2 p-0">
            {page.fullPath}
          </AppLink>
        </div>
      ))}
    </div>
  )
}
