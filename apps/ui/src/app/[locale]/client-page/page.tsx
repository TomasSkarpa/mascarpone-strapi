import { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { redirect } from "@/lib/navigation"

type Props = { params: Promise<{ locale: Locale }> }

/**
 * Redirects /client-page to the dev pages overview (list of all Strapi pages).
 * Only available in development; in production this route is shadowed by the
 * catch-all and would 404 unless a Strapi page exists at fullPath "/client-page".
 */
export default async function ClientPageRedirect({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect({ href: "/dev/pages-overview", locale })
}
