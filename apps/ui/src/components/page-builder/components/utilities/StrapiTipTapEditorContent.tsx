import React from "react"
import { Data } from "@repo/strapi-types"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { TiptapRichText } from "@/components/elementary/tiptap-editor"
import { pageBuilderSectionY } from "@/components/page-builder/section-layout"

const StrapiTipTapEditorContent = ({
  component,
}: {
  component: Data.Component<"utilities.tip-tap-rich-text">
}) => {
  removeThisWhenYouNeedMe("StrapiTipTapEditorContent")

  return (
    <Container className={cn("tip-tap-editor-wrapper", pageBuilderSectionY)}>
      <div className="w-full text-balance">
        <TiptapRichText content={component.content} />
      </div>
    </Container>
  )
}

export default StrapiTipTapEditorContent
