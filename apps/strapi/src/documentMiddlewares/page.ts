import { Modules } from "@strapi/strapi"

import { animatedLogoRowPopulate } from "./sections/AnimatedLogoRow"
import { contactFormPopulate } from "./sections/ContactForm"
import { faqPopulate } from "./sections/Faq"
import { headingWithCtaButtonPopulate } from "./sections/HeadingWithCtaButton"
import { heroPopulate } from "./sections/Hero"
import { imageWithCtaButtonPopulate } from "./sections/ImageWithCtaButton"
import { newsletterFormPopulate } from "./sections/NewsletterForm"
import { seoPopulate } from "./seo-utilities/Seo"

const pageTypes = ["api::page.page"]
const pageActions = ["findMany"] // We're using findMany to find the pages, but this could be adjusted to findOne per your needs

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
 * Registers a middleware to customize the population of related fields for page documents during Strapi queries.
 *
 * This middleware intercepts document queries for the "api::page.page" content type when the action is "findMany".
 * If the request parameters request a single document (see `isSinglePageQuery`) and include a
 * 'middlewarePopulate' array, it selectively applies deep population rules for specified attributes,
 * as defined in 'pagePopulateObject'.
 *
 * The request must contain 'middlewarePopulate' (array of string keys) in the 'params' object, which is going to be mapped to 'pagePopulateObject' attributes.
 *
 */
export const registerPopulatePageMiddleware = ({ strapi }) => {
  strapi.documents.use((context, next) => {
    if (
      pageTypes.includes(context.uid) &&
      pageActions.includes(context.action)
    ) {
      const requestParams: {
        start?: number
        limit?: number
        middlewarePopulate?: Array<string>
        pagination?: { page?: number; pageSize?: number }
      } = context.params
      if (
        isSinglePageQuery(requestParams) &&
        Array.isArray(requestParams?.middlewarePopulate) &&
        context.params.populate != null
      ) {
        requestParams.middlewarePopulate
          .filter((populateAttr) =>
            Object.keys(pagePopulateObject).includes(populateAttr)
          )
          .forEach((populateAttr) => {
            context.params.populate[populateAttr] =
              pagePopulateObject[populateAttr]
          })
      }
    }

    return next()
  })
}

const pagePopulateObject: Modules.Documents.ServiceParams<"api::page.page">["findOne"]["populate"] =
  {
    content: {
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
        "forms.newsletter-form": newsletterFormPopulate,
        "forms.contact-form": contactFormPopulate,
        "utilities.ck-editor-content": true,
        "utilities.ck-editor-text": true,
        "utilities.tip-tap-rich-text": true,
      },
    },
    seo: seoPopulate,
  }
