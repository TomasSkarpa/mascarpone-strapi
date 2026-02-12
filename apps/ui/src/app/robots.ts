import type { MetadataRoute } from "next"

import { getEnvVar } from "@/lib/env-vars"
import { isProduction } from "@/lib/general-helpers"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getEnvVar("APP_PUBLIC_URL")

  if (!isProduction()) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account"],
      },
      {
        userAgent: [
          "UbiCrawler",
          "DOC",
          "Zao",
          "sitecheck.internetseer.com",
          "Zealbot",
          "MSIECrawler",
          "SiteSnagger",
          "WebStripper",
          "WebCopier",
          "Fetch",
          "Offline Explorer",
          "Teleport",
          "TeleportPro",
          "WebZIP",
          "linko",
          "HTTrack",
          "Microsoft.URL.Control",
          "Xenu",
          "larbin",
          "libwww",
          "ZyBORG",
          "Download Ninja",
          "fast",
          "Maxthon",
          "CNCDialer",
          "MJ12bot",
        ],
        disallow: "/",
      },
    ],
    ...(baseUrl ? { sitemap: new URL("sitemap.xml", baseUrl).toString() } : {}),
  }
}
