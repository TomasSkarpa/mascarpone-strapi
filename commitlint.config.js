module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-pnpm-scopes",
  ],
  rules: {
    // Default conventional body/footer line caps are 100; subject was 72 (very tight for scopes).
    "header-max-length": [2, "always", 120],
    "body-max-line-length": [2, "always", 200],
    "footer-max-line-length": [2, "always", 200],
  },
}
