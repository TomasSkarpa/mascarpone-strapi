import React from "react"
import { Data } from "@repo/strapi-types"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { Container } from "@/components/elementary/Container"
import { pageBuilderSectionY } from "@/components/page-builder/section-layout"
import { TiptapRichText } from "@/components/elementary/tiptap-editor"
import { cn } from "@/lib/styles"

const StrapiTipTapEditorContent = ({
  component,
}: {
  component: Data.Component<"utilities.tip-tap-rich-text">
}) => {
  removeThisWhenYouNeedMe("StrapiTipTapEditorContent")

  return (
    <Container
      className={cn("tip-tap-editor-wrapper", pageBuilderSectionY)}
    >
      <div className="w-full text-balance">
        <TiptapRichText content={component.content} />
      </div>
    </Container>
  )
}

export default StrapiTipTapEditorContent
