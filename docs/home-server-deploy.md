# Home server deploy (dev.hannie.space)

The Strapi image is built and deployed by **GitHub Actions** on a **self-hosted runner** running on the same home server as the stack (same pattern as [flagged-it Deploy Backend](https://github.com/TomasSkarpa/flagged-it/blob/main/.github/workflows/deploy-backend.yml)).

## What runs

| Piece                                                      | Repository / location                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| nginx TLS, `docker-compose.yml`, server `.env`, data paths | [home_server_iac](https://github.com/TomasSkarpa/home_server_iac) Ansible role `mascarpone_strapi_dev` |
| Build + `docker compose pull` / `up`                       | This repo — [`.github/workflows/deploy-home-server.yml`](../.github/workflows/deploy-home-server.yml)  |

## Prerequisites

1. **Ansible** from `home_server_iac` has been applied at least once (`mascarpone` tag or full playbook) so `/home/home/mascarpone-deploy/` exists with compose + `.env`. Use `ansible/host_vars/home.yml` there for **`letsencrypt_contact_email`** (and optional GHCR credentials) so TLS for `dev.hannie.space` is issued automatically.
2. **Self-hosted runner** can run workflows for **this** repository (org-level runner or a runner registered for this repo).
3. Runner user can run **Docker** (`docker` group) and read the deploy directory.
4. **GHCR**: workflow uses `GITHUB_TOKEN` with `packages: write` to push `ghcr.io/<github_owner_lower>/mascarpone-strapi:main`. The image name must match `mascarpone_strapi_image` in `home_server_iac` `group_vars/all.yml`.

## Trigger

- Push to **`main`** (any path), or **workflow_dispatch**.

## What the workflow does

1. `actions/checkout`
2. `docker login ghcr.io`
3. `docker build -f apps/strapi/Dockerfile` from monorepo root, tag `ghcr.io/<owner>/mascarpone-strapi:main`, **push**
4. `cd /home/home/mascarpone-deploy && docker compose pull strapi && docker compose up -d`
5. `curl` to `http://127.0.0.1:1337/` on the host (must match `mascarpone_strapi_host_port` in IaC; default **1337**).

It does **not** manage nginx or systemd; those stay in **home_server_iac**.

## One-time DB + uploads migration

See [home_server_iac docs/mascarpone-strapi.md](https://github.com/TomasSkarpa/home_server_iac/blob/main/docs/mascarpone-strapi.md): `pg_dump -Fc`, optional playbook restore, sync `apps/strapi/public/uploads` to the server uploads directory.

## Local dev against server data

Use an **SSH tunnel** to Postgres on the server; do not expose Postgres publicly. Set `APP_URL=https://dev.hannie.space` when you want public URLs to match the dev deployment. Avoid running two Strapi instances against the same DB during schema migrations.
