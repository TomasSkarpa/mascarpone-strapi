import React from "react"

import { FormDescription } from "@/components/ui/form"

type Props = {
  readonly description?: React.ReactNode
}

export function AppFormDescription({ description }: Props) {
  if (description == null) {
    return null
  }

  return <FormDescription>{description}</FormDescription>
}
