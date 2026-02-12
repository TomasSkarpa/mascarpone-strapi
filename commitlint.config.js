module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-pnpm-scopes",
  ],
  rules: {
    "header-max-length": [2, "always", 72],
  },
}
