import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { ImageProps } from "next/image"

export type ImageExtendedProps = Omit<ImageProps, "src"> & {
  fallbackSrc?: string
  src: string | StaticImport
}

type PageSearchParams = Record<string, string | string[] | undefined>

/** App Router pages: async `params` / `searchParams` (Next 15+). Route string → loose params; object → `{ locale }` plus dynamic keys. */
export type PageProps<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- `{}` default = locale-only params for `PageProps` without generic
  T extends string | Record<string, string | string[]> = {},
> = T extends string
  ? {
      params: Promise<Record<string, string | string[] | undefined>>
      searchParams?: Promise<PageSearchParams>
    }
  : {
      params: Promise<{ locale: string } & T>
      searchParams?: Promise<PageSearchParams>
    }
