import { Modules } from "@strapi/strapi"

import { animatedLogoRowPopulate } from "./sections/AnimatedLogoRow"
import { contactFormPopulate } from "./sections/ContactForm"
import { faqPopulate } from "./sections/Faq"
import { headingWithCtaButtonPopulate } from "./sections/HeadingWithCtaButton"
import { heroPopulate } from "./sections/Hero"
import { imageWithCtaButtonPopulate } from "./sections/ImageWithCtaButton"
import { newsletterFormPopulate } from "./sections/NewsletterForm"
import { seoPopulate } from "./seo-utilities/Seo"

/** Shared dynamic-zone population for Page `content` and Projects page `belowProjects`. */
export const dynamicZonePageContentPopulate = {
  on: {
    "sections.image-with-cta-button": imageWithCtaButtonPopulate,
    "sections.hero": heroPopulate,
    "sections.heading-with-cta-button": headingWithCtaButtonPopulate,
    "sections.faq": faqPopulate,
    "sections.animated-logo-row": animatedLogoRowPopulate,
    "sections.adaptive-gallery": {
      populate: {
        images: {
          populate: { image: { populate: { media: true } }, link: true },
        },
      },
    },
    "sections.attachment-download": {
      populate: { file: true },
    },
    "sections.timeline": {
      populate: { milestones: true },
    },
    "sections.quote-carousel": {
      populate: { quotes: true },
    },
    "sections.project-showcase": {
      populate: {
        projects: {
          populate: {
            image: true,
            tags: true,
            links: true,
          },
        },
      },
    },
    "sections.section-labeled-divider": true,
    "sections.commendations-panel": {
      populate: {
        items: {
          populate: { avatar: { populate: { media: true } } },
        },
      },
    },
    "sections.scheduled-fal-output": true,
    "forms.newsletter-form": newsletterFormPopulate,
    "forms.contact-form": contactFormPopulate,
    "utilities.ck-editor-content": true,
    "utilities.ck-editor-text": true,
    "utilities.tip-tap-rich-text": true,
  },
} as const

const introDynamicZonePopulate = {
  on: {
    "utilities.ck-editor-content": true,
    "utilities.ck-editor-text": true,
    "utilities.tip-tap-rich-text": true,
  },
} as const

const pagePopulateObject: Modules.Documents.ServiceParams<"api::page.page">["findOne"]["populate"] =
  {
    content: dynamicZonePageContentPopulate,
    seo: seoPopulate,
  }

const projectsPagePopulateObject: Record<string, unknown> = {
  intro: introDynamicZonePopulate,
  belowProjects: dynamicZonePageContentPopulate,
  seo: seoPopulate,
}

const populateByUid: Record<
  string,
  Record<string, unknown> | typeof pagePopulateObject
> = {
  "api::page.page": pagePopulateObject,
  "api::projects-page.projects-page": projectsPagePopulateObject,
}

const documentUidsWithPopulateMiddleware = Object.keys(populateByUid)

const pageActions = ["findMany"] // We're using findMany to find the pages, but this could be adjusted for findOne per your needs

/**
 * True when the query is asking for a single page — same cases as
 * `PublicStrapiClient.fetchOneByFullPath` (pagination page 1 / size 1, or start 0 / limit 1).
 * The document service may only set `pagination` and not `start`/`limit` before middleware runs.
 */
function isSinglePageQuery(params: {
  start?: number
  limit?: number
  pagination?: { page?: number; pageSize?: number }
}): boolean {
  if (params.start === 0 && params.limit === 1) {
    return true
  }
  const p = params.pagination
  if (p != null && p.page === 1 && p.pageSize === 1) {
    return true
  }
  return false
}

/**
 * Registers middleware to customize population for Page and Projects page documents.
 */
export const registerPopulatePageMiddleware = ({ strapi }) => {
  strapi.documents.use((context, next) => {
    const populateObject = populateByUid[context.uid]
    if (
      !populateObject ||
      !documentUidsWithPopulateMiddleware.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return next()
    }

    const requestParams: {
      start?: number
      limit?: number
      middlewarePopulate?: Array<string>
      pagination?: { page?: number; pageSize?: number }
    } = context.params
    const allowPopulate =
      Array.isArray(requestParams?.middlewarePopulate) &&
      context.params.populate != null &&
      (context.uid === "api::projects-page.projects-page" ||
        isSinglePageQuery(requestParams))

    if (allowPopulate) {
      requestParams
        .middlewarePopulate!.filter((populateAttr) =>
          Object.keys(populateObject).includes(populateAttr)
        )
        .forEach((populateAttr) => {
          ;(context.params.populate as Record<string, unknown>)[populateAttr] =
            populateObject[populateAttr] as unknown
        })
    }

    return next()
  })
}
