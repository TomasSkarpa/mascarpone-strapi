import { LinkBreak2Icon } from "@radix-ui/react-icons"
import { getTranslations } from "next-intl/server"

import { Link } from "@/lib/navigation"

export default async function NotFound() {
  const t = await getTranslations("errors.notFound")
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 sm:py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 sm:max-w-md sm:gap-6">
        <LinkBreak2Icon
          className="text-muted-foreground size-8 shrink-0"
          aria-hidden
        />
        <div className="flex w-full flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-balance whitespace-pre-line sm:text-3xl">
            {t("title")}
          </h1>
          <div className="text-muted-foreground mt-3 space-y-3 text-sm sm:mt-4 sm:text-base">
            <p className="leading-relaxed text-pretty">{t("description")}</p>
            <p className="leading-relaxed text-pretty whitespace-pre-line">
              {t("solution")}
            </p>
          </div>
        </div>
        <Link
          className="mt-1 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-500 hover:bg-gray-700 sm:px-7"
          href="/"
        >
          {t("redirect")}
        </Link>
      </div>
    </div>
  )
}
