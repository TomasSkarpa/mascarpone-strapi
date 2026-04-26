import { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { pageBuilderFaqTriggerClass } from "@/components/page-builder/interaction-styles"
import {
  pageBuilderSectionIntroClass,
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function StrapiFaq({
  component,
}: {
  readonly component: Data.Component<"sections.faq">
}) {
  return (
    <section>
      <Container
        className={cn(pageBuilderSectionY, "text-gray-900 dark:text-gray-900")}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 text-left md:mb-10 md:text-center">
            <h2
              className={cn(
                "mb-4 text-balance",
                pageBuilderSectionTitleClass,
                "!text-gray-900 dark:!text-gray-900"
              )}
            >
              {component.title}
            </h2>
            {component.subTitle && (
              <p
                className={cn(
                  "text-balance",
                  pageBuilderSectionIntroClass,
                  "text-gray-700 dark:text-gray-700"
                )}
              >
                {component.subTitle}
              </p>
            )}
          </div>

          {component.accordions && (
            <Accordion
              type="single"
              collapsible
              className="space-y-3 sm:space-y-4"
            >
              {component.accordions.map((x) => (
                <AccordionItem
                  key={x.id}
                  value={x.id.toString()}
                  className={cn(
                    "border-b-0",
                    "overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm",
                    "transition-[box-shadow,border-color] [transition-duration:var(--app-motion-collapse-duration)] [transition-timing-function:var(--app-motion-ease)]",
                    "hover:border-gray-300/90 hover:shadow",
                    "data-[state=open]:border-gray-200 data-[state=open]:shadow-md",
                    "dark:border-gray-200 dark:bg-white dark:shadow-sm",
                    "dark:hover:border-gray-300 dark:hover:shadow",
                    "dark:data-[state=open]:bg-white"
                  )}
                >
                  <AccordionTrigger
                    className={cn(
                      "px-5 py-4 sm:px-6",
                      "no-underline hover:no-underline",
                      "justify-between gap-3",
                      pageBuilderFaqTriggerClass
                    )}
                  >
                    {x.question}
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-gray-100 bg-white !pt-0 text-sm leading-relaxed text-gray-800 sm:text-base">
                    <div className="px-5 pt-3 pb-4 sm:px-6 sm:pt-3.5 sm:pb-5">
                      {x.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq
