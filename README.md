# Main Template V2 (React + Vite)

Production-ready React starter with:

- Vite + React 19
- Redux Toolkit + redux-persist
- React Query (with persisted cache)
- Ant Design 6 + Tailwind CSS 4
- `abzed-utils@2.x` UI/hooks helpers

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` (or update existing):

```env
VITE_API_URL=http://localhost:8080
VITE_LOGOUT_URL=http://localhost:5173
VITE_DEFAULT_TIMER=10
```

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
