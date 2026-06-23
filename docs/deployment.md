# Deployment & CI/CD

Production pipeline for the template: **GitLab CI/CD** builds a Docker image
(Vite build → nginx static serve) and deploys it over VPN+SSH. GitHub Actions
runs the quality gate (`npm run check`) on every push.

```
develop ──▶ build image (test scope)  ──▶ deploy to $VITE_CI_TEST_URL
master  ──▶ build image (prod scope)  ──▶ deploy to $VITE_CI_PROD_URL
```

Files: `.gitlab-ci.yml`, `Dockerfile`, `nginx.conf`, `.dockerignore`,
`env-upload.sh`, `.github/workflows/ci.yml`.

---

## Starting a new project — the only things to change

### 1. Edit `.env` (single source of truth)

All per-project config is `VITE_*` in your env files. Set it there and push to
GitLab with `env-upload.sh` (step 2) — the uploaded values override the fallback
defaults in `.gitlab-ci.yml`, so you normally **edit no pipeline files**.

**App config** (bundled into the client):

| Key                                                     | What it is             |
| ------------------------------------------------------- | ---------------------- |
| `VITE_API_URL`, `VITE_LOGOUT_URL`, `VITE_DEFAULT_TIMER` | core app config        |
| `VITE_SESSION_*`                                        | session-timeout tuning |

**Deploy / CI config** (consumed by `.gitlab-ci.yml`, **not** bundled):

| Key                                                        | What it is                                           |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `VITE_CI_APP_NAME`                                         | container name base                                  |
| `VITE_CI_DEPLOY_NETWORK`                                   | docker network on the deploy server                  |
| `VITE_CI_FRONTEND_PORT`                                    | host port the container binds on the server          |
| `VITE_CI_SONAR_PROJECT_KEY` / `VITE_CI_SONAR_PROJECT_NAME` | SonarQube identity (optional)                        |
| `VITE_CI_TEST_URL` / `VITE_CI_PROD_URL`                    | environment URLs shown in GitLab                     |
| `VITE_CI_VPN_PING_HOST`                                    | internal host pinged to confirm the VPN tunnel is up |

**Tooling** (in `.env.local` only — never pushed, never bundled):
`VITE_CI_GITLAB_PROJECT_ID`, `VITE_CI_GITLAB_TOKEN`.

### 2. Push config + secrets to GitLab CI/CD

Use `env-upload.sh` (below) for the `VITE_*` config. Add the deploy **secrets**
manually (or via `--file`), scope `*` unless noted:

- VPN: `OVPN_CONFIG` (type **File**), `OVPN_USER`, `OVPN_PASS`, `OVPN_KEY_PASS`
- Test SSH: `SSH_PRIVATE_KEY_B64` (base64), `DEPLOY_USER`, `DEPLOY_HOST`
- Prod SSH: `ICOLO_SSH_PRIVATE_KEY_B64` (base64), `ICOLO_DEPLOY_USER`, `ICOLO_DEPLOY_HOST`
- SonarQube (optional): `SONAR_HOST_URL`, `SONAR_TOKEN` (stage auto-skips when unset)

Container/registry/tagging use built-in `$CI_*` variables.

---

## Adding a variable — no pipeline edits (for app vars)

`VITE_*` app values are inlined by Vite at build time. The build job dumps every
`VITE_*` CI/CD variable (except the `VITE_CI_` namespace) into `.env.production`,
which Vite reads. So to add a **front-end** variable:

1. Add `VITE_MY_FLAG` to `.env*` and push it (`env-upload.sh`).
2. Document it in `.env.example`.
3. Read it via `src/utils.jsx` (`import.meta.env.VITE_MY_FLAG`).

No change to `Dockerfile`, `.gitlab-ci.yml`, or `nginx.conf`.

> Adding a **deploy/infra** variable (not meant for the browser)? Name it
> `VITE_CI_FOO`. The whole `VITE_CI_` namespace is excluded from the bundle by a
> single rule in the build — nothing else to maintain.

---

## `env-upload.sh` — push a local env file to GitLab

Set these once in `.env.local` (gitignored, not bundled):

```bash
VITE_CI_GITLAB_PROJECT_ID=123            # the project's GitLab id
VITE_CI_GITLAB_TOKEN=glpat-xxxxxxxx      # personal access token (api scope)
```

Then the project id + token are picked up automatically:

```bash
./env-upload.sh test   .env.test      # test scope      (develop deploys)
./env-upload.sh prod   .env.prod      # production scope (master deploys)
./env-upload.sh shared .env.shared    # scope=* (all envs)

# File-type variable (e.g. the OpenVPN profile):
./env-upload.sh shared .env.shared --file OVPN_CONFIG=./client.ovpn

# Preview without calling the API:
./env-upload.sh test .env.test --dry-run

# Override the id ad-hoc:
./env-upload.sh test .env.test --project-id 999
```

Keys matching `TOKEN|SECRET|PASSWORD|PASS$|KEY_B64|API_KEY` are uploaded masked.

---

## Building the image locally

```bash
# Uses defaults from src/utils.jsx unless you provide a .env.production:
docker build -t my-app .
docker run --rm -p 8080:80 my-app   # http://localhost:8080
```

> The lockfile is gitignored, so both CI and the Dockerfile use `npm install`
> (not `npm ci`).
