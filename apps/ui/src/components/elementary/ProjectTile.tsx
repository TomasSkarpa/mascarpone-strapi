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

export function ProjectTile({ project, locale }: ProjectTileProps) {
  return (
    <Link
      href={`/${locale}/projects/${project.documentId}`}
      className="portfolio-card-lift focus-visible:ring-primary-600 flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-[box-shadow,transform] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.995] active:shadow-md"
    >
      {project.image?.url && (
        <div className="relative aspect-video">
          <Image
            src={formatStrapiMediaUrl(project.image.url)}
            alt={project.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-grow flex-col p-6">
        <div className="flex-grow">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-900">
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

          {project.links?.length && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 focus-visible:outline-none active:scale-95"
                >
                  {link.type}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
