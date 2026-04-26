import { Calendar } from "lucide-react"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import {
  pageBuilderSectionIntroClass,
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"

export function StrapiTimeline({
  component,
}: {
  readonly component: Data.Component<"sections.timeline">
}) {
  return (
    <section>
      <Container className={pageBuilderSectionY}>
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 text-left md:mb-10 md:text-center">
            <h2 className={`mb-4 text-balance ${pageBuilderSectionTitleClass}`}>
              {component.title}
            </h2>
            {component.subTitle && (
              <p className={`text-balance ${pageBuilderSectionIntroClass}`}>
                {component.subTitle}
              </p>
            )}
          </div>

          {component.milestones && (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-300 md:left-1/2 md:-translate-x-px md:transform" />

              <div className="space-y-8">
                {component.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`relative flex items-start gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 h-3 w-3 rounded-full border-2 border-white bg-red-500 shadow-md md:left-1/2 md:-translate-x-1/2 md:transform" />

                    {/* Content */}
                    <div
                      className={`ml-12 flex-1 md:ml-0 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
                    >
                      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            {milestone.date}
                          </span>
                          {milestone.company && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-700">
                                {milestone.company}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">
                          {milestone.title}
                        </h3>
                        <p className="leading-relaxed text-gray-800">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiTimeline.displayName = "StrapiTimeline"

export default StrapiTimeline
