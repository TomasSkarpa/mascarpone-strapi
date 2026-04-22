# This is PRODUCTION Dockerfile for Strapi in Turborepo.
# It's assumed that this Dockerfile is run from the root of the monorepo.

# Related references:
# - https://docs.strapi.io/dev-docs/installation/docker#production-dockerfile
# - https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

# Customize APP (name of folder in /apps) and WORKSPACE (name from package.json) to match this app
ARG APP=strapi
ARG WORKSPACE=@repo/strapi

FROM node:22-alpine AS base

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
ARG WORKSPACE

# Install turbo globally to prune below
RUN pnpm add -g turbo@2.7.3

COPY . .

# see https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget
RUN turbo prune ${WORKSPACE} --docker

# ---
FROM base AS builder

ARG APP

# Install turbo globally to use during build below
RUN pnpm add -g turbo@2.7.3
# Install node-gyp globally to build native addons
RUN pnpm add -g node-gyp

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prepare /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Override NODE_ENV for build stage to install all dependencies including devDependencies
# They (typescrip, tailwindcss etc.) are needed during build and pnpm would skip them from the start
ENV NODE_ENV=development

# see https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md#run---mounttypecache
RUN \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline --ignore-scripts

ENV PATH=/app/apps/${APP}/node_modules/.bin:$PATH

# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build

# Do not run `pnpm prune --prod` here: in a pnpm + turbo-pruned monorepo it can drop or relocate
# packages so `apps/strapi/node_modules/@strapi/strapi/...` is missing at runtime (MODULE_NOT_FOUND).
# Image is larger; acceptable for self-hosted. (Alternatives: pnpm deploy, or a slimmer per-app stage.)

# ---
FROM node:22-alpine AS runner

RUN apk add --no-cache vips-dev

ARG APP=strapi
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Non-root user with a real $HOME (pnpm/Node need a writable home). Create user before pnpm so we can chown /pnpm.
# Alpine: -h sets home, -D disables password, -S = system user.
RUN addgroup -S -g 1001 strapi 2>/dev/null || addgroup -g 1001 -S strapi; \
  adduser -S -D -G strapi -u 1001 -h /home/strapi -s /bin/sh strapi

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /pnpm \
  && corepack enable && corepack prepare pnpm@10.28.1 --activate \
  && chown -R strapi:strapi /pnpm

WORKDIR /app
COPY --from=builder --chown=strapi:strapi /app /app

ENV PATH=/app/apps/${APP}/node_modules/.bin:$PATH
ENV HOME=/home/strapi

USER strapi
EXPOSE 1337
# Monorepo root + pnpm filter match how dependencies are linked after turbo prune
CMD ["sh", "-c", "cd /app && exec pnpm --filter @repo/strapi start"]