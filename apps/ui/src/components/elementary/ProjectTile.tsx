"use client"

import Image from "next/image"
import Link from "next/link"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

interface ProjectTileProps {
  project: Data.ContentType<"api::project.project">
  locale: Locale
}

const projectLinkButtonClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 text-sm font-medium text-white shadow-md ring-1 ring-white/20 transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-red-900 focus-visible:outline-none active:scale-95 active:from-red-800 active:to-red-900"

export function ProjectTile({ project, locale }: ProjectTileProps) {
  const links = project.links
  const showLinksOnImage = Boolean(project.image?.url && links?.length)
  const detailHref = `/${locale}/projects/${project.documentId}`
  const titleId = `project-tile-title-${project.documentId}`

  return (
    <article className="portfolio-card-lift relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-[box-shadow,transform] hover:shadow-xl active:scale-[0.995] active:shadow-md">
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-labelledby={titleId}
      />

      <div className="relative z-10 flex min-h-0 flex-grow flex-col pointer-events-none">
        {project.image?.url && (
          <div className="relative aspect-video">
            <Image
              src={formatStrapiMediaUrl(project.image.url)}
              alt={project.title ?? ""}
              fill
              className="object-cover"
            />
            {showLinksOnImage && links && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 pt-10">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pointer-events-auto ${projectLinkButtonClass}`}
                  >
                    {link.type}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-grow flex-col p-6">
          <div className="flex-grow">
            <h3
              id={titleId}
              className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-900"
            >
              {project.title}
            </h3>
            <p className="mb-4 line-clamp-3 text-gray-800">
              {project.description}
            </p>
          </div>

          <div className="mt-auto space-y-3">
            {project.tags?.length && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {links?.length && !showLinksOnImage && (
              <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pointer-events-auto ${projectLinkButtonClass}`}
                  >
                    {link.type}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
