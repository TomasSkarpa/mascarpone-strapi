import { mergeWith } from "lodash"
import { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import type { SocialMetadata } from "@/types/general"
import type { UID } from "@repo/strapi-types"
import type { Metadata } from "next"

import { getEnvVar } from "@/lib/env-vars"
import { isProduction } from "@/lib/general-helpers"
import { debugSeoGeneration } from "@/lib/metadata/debug"
import {
  getDefaultMetadata,
  getDefaultOgMeta,
  getDefaultTwitterMeta,
} from "@/lib/metadata/defaults"
import {
  generateDescriptionFromContent,
  generateDescriptionFromTitle,
  generateKeywordsFromPage,
  generateMetaTitle,
} from "@/lib/metadata/fallbacks"
import {
  getMetaAlternates,
  getMetaRobots,
  preprocessSocialMetadata,
  seoMergeCustomizer,
} from "@/lib/metadata/helpers"
import { fetchPage, fetchSeo } from "@/lib/strapi-api/content/server"

export async function getMetadataFromStrapi({
  fullPath,
  locale,
  customMetadata,
  uid = "api::page.page",
}: {
  fullPath?: string
  locale: Locale
  customMetadata?: Metadata
  // Add more content types here if we want to fetch SEO components for them
  uid?: Extract<UID.ContentType, "api::page.page">
}): Promise<Metadata | null> {
  const t = await getTranslations({ locale, namespace: "seo" })
  const siteUrl = getEnvVar("APP_PUBLIC_URL")
  if (!siteUrl) {
    console.warn("APP_PUBLIC_URL is not defined, cannot generate metadata")
    return null
  }

  const defaultMeta: Metadata = getDefaultMetadata(siteUrl, t)
  const defaultOgMeta: Metadata["openGraph"] = getDefaultOgMeta(
    locale,
    fullPath,
    t
  )
  const defaultTwitterMeta: Metadata["twitter"] = getDefaultTwitterMeta(t)

  // skip strapi fetching and return SEO from translations
  if (!fullPath) {
    return {
      ...defaultMeta,
    }
  }

  try {
    return await fetchAndMapStrapiMetadata(
      locale,
      fullPath,
      defaultMeta,
      defaultOgMeta,
      defaultTwitterMeta,
      customMetadata,
      uid
    )
  } catch (e: unknown) {
    console.warn(
      `SEO for ${uid} content type ("${fullPath}") wasn't fetched: `,
      (e as Error)?.message
    )
    return {
      ...defaultMeta,
    }
  }
}

async function fetchAndMapStrapiMetadata(
  locale: Locale,
  fullPath: string | null,
  defaultMeta: Metadata,
  defaultOgMeta: Metadata["openGraph"],
  defaultTwitterMeta: Metadata["twitter"],
  customMetadata?: Metadata,
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page"
) {
  const forbidIndexing = !isProduction()
  const [seoRes, pageRes] = await Promise.all([
    fetchSeo(uid, fullPath, locale),
    fullPath ? fetchPage(fullPath, locale) : null,
  ])

  const seo = seoRes?.data?.seo
  const { localizations } = seoRes?.data || {}
  const pageData = pageRes?.data || seoRes?.data

  const fallbackTitle = pageData?.title || pageData?.breadcrumbTitle
  const fallbackMetaTitle = generateMetaTitle(fallbackTitle, seo?.siteName)
  const fallbackDescription =
    generateDescriptionFromContent(pageData?.content) ||
    generateDescriptionFromTitle(fallbackTitle)
  const fallbackKeywords = generateKeywordsFromPage(
    pageData?.title,
    pageData?.breadcrumbTitle,
    pageData?.slug
  )

  const siteUrl = getEnvVar("APP_PUBLIC_URL")
  const strapiMeta: Metadata = {
    title: seo?.metaTitle || fallbackMetaTitle || fallbackTitle,
    description: seo?.metaDescription || fallbackDescription,
    keywords: seo?.keywords || fallbackKeywords,
    robots: seo?.metaRobots,
    applicationName: seo?.applicationName,
    alternates: {
      canonical:
        seo?.canonicalUrl ||
        (fullPath && siteUrl
          ? `${siteUrl}/${locale}${fullPath}`
          : undefined),
    },
  }

  const robots = getMetaRobots(seo?.metaRobots, forbidIndexing)
  const alternates = getMetaAlternates({
    seo,
    fullPath,
    locale,
    localizations,
  })
  const strapiSocialMeta: SocialMetadata = preprocessSocialMetadata(
    seo,
    alternates?.canonical
  )

  const finalMetadata = {
    ...mergeWith(defaultMeta, strapiMeta, seoMergeCustomizer),
    openGraph: mergeWith(
      defaultOgMeta,
      strapiSocialMeta.openGraph,
      seoMergeCustomizer
    ),
    twitter: mergeWith(
      defaultTwitterMeta,
      strapiSocialMeta.twitter,
      seoMergeCustomizer
    ),
    robots,
    alternates,
    ...customMetadata,
  }

  debugSeoGeneration(finalMetadata, pageData, seo, fullPath || "Unknown page")

  return finalMetadata
}
