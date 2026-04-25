import { mergeConfig } from "vite"

import type { UserConfig } from "vite"

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      // Vite 6+ host checks: include public admin hostname; keep local dev working when this replaces defaults on merge
      allowedHosts: [".localhost", "127.0.0.1", "::1", "admin.hannie.space"],
    },
  } as UserConfig)
}
