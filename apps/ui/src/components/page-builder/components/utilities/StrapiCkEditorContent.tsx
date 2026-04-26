import React from "react"
import { Data } from "@repo/strapi-types"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { pageBuilderSectionY } from "@/components/page-builder/section-layout"

export const StrapiCkEditorContent = ({
  component,
}: {
  readonly component:
    | Data.Component<"utilities.ck-editor-content">
    | Data.Component<"utilities.ck-editor-text">
}) => {
  return (
    <Container className={pageBuilderSectionY}>
      <CKEditorRenderer
        htmlContent={component.content}
        className="w-full text-balance"
      />
    </Container>
  )
}

StrapiCkEditorContent.displayName = "CkEditorContent"

export default StrapiCkEditorContent
