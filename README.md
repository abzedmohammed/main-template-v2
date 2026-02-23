# Main Template V2 (React + Vite)

Production-ready React starter with:

- Vite + React 18
- Redux Toolkit + redux-persist
- React Query (with persisted cache)
- Ant Design + Tailwind CSS
- `abzed-utils` UI/hooks helpers

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
- `npm run check`: Run lint + build
- `npm run audit:prod`: Security audit for production dependencies only

## Project Structure

- `src/actions`: API action configs used by query/mutation hooks
- `src/app`: Redux store setup
- `src/components`: Shared UI and layouts
- `src/features`: Redux slices
- `src/hooks`: Custom hooks (session/token handling)
- `src/pages`: Route-level screens
- `src/routes`: Router config and role-based route mapping

## Notes

- `abzed-utils` is pinned to `1.1.2` for compatibility with `antd@5`.
- Route modules are lazy-loaded for smaller initial bundles.
- Lockfile is intended to be committed for reproducible installs.

## Recommended Workflow

1. Implement feature
2. Run `npm run check`
3. Review warnings and fix before commit
4. Run `npm run audit:prod` for release validation
