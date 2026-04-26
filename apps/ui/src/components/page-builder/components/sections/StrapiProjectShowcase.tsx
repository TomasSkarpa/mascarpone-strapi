import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ProjectTile } from "@/components/elementary/ProjectTile"
import {
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"

interface StrapiProjectShowcaseProps {
  readonly component: Data.Component<"sections.project-showcase">
}

export function StrapiProjectShowcase({
  component,
}: StrapiProjectShowcaseProps) {
  if (!component.projects?.length) return null

  return (
    <section>
      <Container className={pageBuilderSectionY}>
        {component.title && (
          <h2
            className={`mb-10 text-balance text-center sm:mb-12 ${pageBuilderSectionTitleClass}`}
          >
            {component.title}
          </h2>
        )}

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {component.projects.map((project, i) => (
            <ProjectTile
              key={`${project.documentId}-${i}`}
              project={project}
              locale="en"
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default StrapiProjectShowcase
