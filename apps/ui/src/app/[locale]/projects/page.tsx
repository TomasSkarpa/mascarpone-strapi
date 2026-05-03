import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import type { PageProps } from "@/types/next"
import type { Data } from "@repo/strapi-types"
import type { Metadata } from "next"
import type { Locale } from "next-intl"

import {
  fetchAllProjects,
  fetchPage,
  fetchProjectsLandingPage,
} from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { ProjectTile } from "@/components/elementary/ProjectTile"
import { PageContentComponents } from "@/components/page-builder"

type Props = PageProps

type ProjectsLanding = Data.ContentType<"api::projects-page.projects-page">

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale as Locale
  const [t, landing] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    fetchProjectsLandingPage(locale),
  ])
  const metaTitle = landing?.data?.seo?.metaTitle?.trim()
  return {
    title: metaTitle || t("title"),
    description: landing?.data?.seo?.metaDescription ?? undefined,
    robots: landing?.data?.seo?.metaRobots ?? undefined,
  }
}

export default async function ProjectsPage(props: Props) {
  const params = await props.params
  const locale = params.locale as Locale

  setRequestLocale(locale)

  const [projectsResponse, homePageResponse, landingResponse] =
    await Promise.all([
      fetchAllProjects(locale),
      fetchPage("/", locale),
      fetchProjectsLandingPage(locale),
    ])

  if (!projectsResponse?.data?.length) {
    notFound()
  }

  const projects = projectsResponse.data
  const homeTitle =
    homePageResponse?.data?.breadcrumbTitle ||
    homePageResponse?.data?.title ||
    "Home"
  const t = await getTranslations("projects")
  const landing = landingResponse?.data ?? null
  const introBlocks = landing?.intro ?? []
  const belowBlocks = landing?.belowProjects ?? []

  const renderBlocks = (
    blocks: ProjectsLanding["intro"] | ProjectsLanding["belowProjects"]
  ) =>
    blocks
      ?.filter((comp) => comp != null)
      .map((comp) => {
        const name = comp.__component
        const id = comp.id
        const key = `${name}-${id}`
        const Component = PageContentComponents[name]

        if (Component == null) {
          return (
            <div key={key} className="font-medium text-red-500">
              Component &quot;{key}&quot; is not implemented on the frontend.
            </div>
          )
        }

        return (
          <ErrorBoundary key={key}>
            <div className={cn("mb-3 md:mb-8 lg:mb-10")}>
              <Component
                component={comp}
                pageParams={params}
                page={landing ?? undefined}
              />
            </div>
          </ErrorBoundary>
        )
      })

  return (
    <main className={cn("flex w-full flex-col overflow-hidden")}>
      <Container>
        <Breadcrumbs
          breadcrumbs={[
            { title: homeTitle, fullPath: "/" },
            { title: t("title"), fullPath: "/projects" },
          ]}
          className="mt-6 mb-6"
        />
      </Container>

      <div className={cn("mb-3 md:mb-8 lg:mb-10")}>
        <Container>
          <div className="py-12">
            <h1 className="mb-12 text-center text-4xl font-bold">
              {t("title")}
            </h1>

            {introBlocks.length > 0 && (
              <div className={cn("mx-auto mb-10 max-w-3xl space-y-6 sm:mb-12")}>
                {renderBlocks(introBlocks)}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectTile
                  key={project.documentId}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>

      {belowBlocks.length > 0 && renderBlocks(belowBlocks)}
    </main>
  )
}
