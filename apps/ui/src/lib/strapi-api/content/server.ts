import "server-only"

import { draftMode } from "next/headers"
import { UID } from "@repo/strapi-types"
import { Locale } from "next-intl"

import type { CustomFetchOptions } from "@/types/general"

import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"

// ------ Page fetching functions

export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: {
          content: true, // ensures typing is valid on the resulting object
          seo: true,
        },
        middlewarePopulate: ["content", "seo"], // ensures the middleware is triggered and the populate object is replaced
      },
      requestInit,
      options
    )
  } catch (e: any) {
    logNonBlockingError({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

export async function fetchAllPages(
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchAll(uid, {
      locale,
      fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
      populate: {},
      status: "published",
    })
  } catch (e: any) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
      locale,
      populate: {
        seo: {
          populate: {
            metaImage: true,
          },
        },
        localizations: true,
      },
      fields: ["title", "breadcrumbTitle", "slug"],
    })
  } catch (e: any) {
    logNonBlockingError({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ------ Navbar fetching functions

export async function fetchNavbar(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::navbar.navbar", undefined, {
      locale,
      populate: {
        links: { populate: { page: true } },
        logoImage: {},
        socialIcons: true,
        designerTitle: true,
      },
    })
  } catch (e: any) {
    logNonBlockingError({
      message: `Error fetching navbar for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::footer.footer", undefined, {
      locale,
      populate: {
        sections: {
          populate: { links: { populate: { page: true } } },
        },
        links: { populate: { page: true } },
        socialIcons: true,
        quoteCarousel: { populate: { quotes: true } },
      },
    })
  } catch (e: any) {
    logNonBlockingError({
      message: `Error fetching footer for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ------ Project fetching functions

export async function fetchAllProjects(locale: AppLocale) {
  try {
    return await PublicStrapiClient.fetchAll("api::project.project", {
      locale,
      populate: {
        image: true,
        tags: true,
        links: true,
      },
      status: "published",
    })
  } catch (e: any) {
    console.error({
      message: `Error fetching all projects for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
    return { data: [] }
  }
}

export async function fetchProject(documentId: string, locale: AppLocale) {
  try {
    return await PublicStrapiClient.fetchOne(
      "api::project.project",
      documentId,
      {
        locale,
        populate: {
          image: true,
          tags: true,
          links: true,
          content: true,
        },
        middlewarePopulate: ["content"],
        status: "published",
      }
    )
  } catch (e: any) {
    console.error({
      message: `Error fetching project '${documentId}' for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

export async function fetchProjectsPage(locale: AppLocale) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      "/projects",
      {
        locale,
        populate: {
          content: true,
          seo: true,
        },
        middlewarePopulate: ["content", "seo"],
        status: "published",
      }
    )
  } catch (e: any) {
    console.error({
      message: `Error fetching projects page for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}
