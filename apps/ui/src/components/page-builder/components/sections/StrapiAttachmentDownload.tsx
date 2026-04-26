"use client"

import { Download } from "lucide-react"

import type { Data } from "@repo/strapi-types"

import { getClientStrapiFileUrl } from "@/lib/strapi-helpers"
import { Container } from "@/components/elementary/Container"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import { Button } from "@/components/ui/button"

export function StrapiAttachmentDownload({
  component,
}: {
  readonly component: Data.Component<"sections.attachment-download">
}) {
  return (
    <section>
      <Container className={pageBuilderSectionY}>
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 text-left text-balance md:mb-8 md:text-center">
            <h2 className={`mb-4 ${pageBuilderSectionTitleClass}`}>
              {component.title}
            </h2>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50/30 to-red-50/20 p-6 shadow-sm transition-all duration-300 ease-in-out hover:border-red-200 hover:shadow-lg md:p-12">
            {/* Decorative background elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-red-100/30 blur-xl transition-all duration-500 group-hover:bg-red-200/40" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-gray-100/40 blur-2xl" />

            {/* Mobile: Stack vertically, Desktop: Horizontal with position control */}
            <div className="relative flex flex-col items-center gap-6 md:flex-row-reverse md:gap-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-lg md:h-20 md:w-20">
                <Download className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>

              <div className="flex-1 space-y-4 text-center md:space-y-5 md:text-left">
                <div className="space-y-2">
                  <p className="text-base leading-relaxed font-medium text-gray-700 md:text-lg">
                    {component.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-700 md:justify-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>{component.statusText || "Ready to download"}</span>
                    {component.file?.name && (
                      <>
                        <span>•</span>
                        <span className="max-w-32 truncate font-mono md:max-w-none">
                          {component.file.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={async () => {
                    const url = getClientStrapiFileUrl(component.file?.url)
                    if (!url) {
                      return
                    }
                    const filename = component.file?.name || "download"

                    try {
                      const response = await fetch(url)
                      const blob = await response.blob()
                      const downloadUrl = window.URL.createObjectURL(blob)
                      const link = document.createElement("a")
                      link.href = downloadUrl
                      link.download = filename
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      window.URL.revokeObjectURL(downloadUrl)
                    } catch {
                      window.open(url, "_blank")
                    }
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {component.buttonLabel || "Download Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiAttachmentDownload.displayName = "StrapiAttachmentDownload"

export default StrapiAttachmentDownload
