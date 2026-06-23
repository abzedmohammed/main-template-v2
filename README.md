# Main Template V2 (React + Vite)

Production-ready React starter with:

- Vite + React 19
- Redux Toolkit + redux-persist
- React Query (with persisted cache)
- Ant Design 6 + Tailwind CSS 4
- `abzed-utils@2.x` UI/hooks helpers

## Create a new project

Scaffold a fresh project from this template — it clones a clean copy, renames it,
seeds `.env.local`, runs `git init`, and installs dependencies:

```bash
npm create abzed-app@latest my-app
cd my-app
npm run dev
```

See [`create-abzed-app`](https://www.npmjs.com/package/create-abzed-app) for
options (`--no-install`, `--no-git`, `--branch`, `--template`).

## Getting Started

> Already inside a clone of this repo? Start here instead.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

`.env.example` documents every key in two groups:

- **App config** (`VITE_*`) — bundled into the client: `VITE_API_URL`,
  `VITE_LOGOUT_URL`, `VITE_DEFAULT_TIMER`, `VITE_SESSION_*`, …
- **Deploy / CI config** (`VITE_CI_*`) — consumed by the pipeline, never bundled:
  `VITE_CI_APP_NAME`, `VITE_CI_TEST_URL`/`VITE_CI_PROD_URL`, etc. (plus
  `VITE_CI_GITLAB_PROJECT_ID` / `VITE_CI_GITLAB_TOKEN` tooling, kept in
  `.env.local` only).

See [`docs/deployment.md`](docs/deployment.md) for the full pipeline + variable reference.

### 3. Start development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Auto-format files with Prettier
- `npm run format:check`: Validate formatting
- `npm run test`: Run unit tests with Vitest
- `npm run test:watch`: Run tests in watch mode
- `npm run check`: Run format check + lint + tests + build
- `npm run audit:prod`: Security audit for production dependencies only

## Project Structure

- `src/actions`: API action configs used by query/mutation hooks
- `src/app`: Redux store setup
- `src/components`: Shared UI and layouts
- `src/features`: Redux slices
- `src/hooks`: Session/token handling and app hooks
- `src/routes`: Router config and role-based route mapping
- `src/services`: App ownership layer for token/auth concerns
- `src/pages`: Route-level screens

## Standards Notes

- App-only concerns (auth redirects, token lifecycle) live in `src/services`.
- `abzed-utils` should remain reusable and avoid app-specific behavior.
- Keep routing strategy explicit (`createHashRouter`) unless deployment needs change.

## Compatibility

See `docs/COMPATIBILITY.md` for supported shared dependency versions.

## Standards

See `docs/STANDARDS.md` for project ownership boundaries and quality rules.
