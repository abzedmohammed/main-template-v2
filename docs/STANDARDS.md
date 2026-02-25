# Engineering Standards (Template)

## Ownership Boundaries

- `src/services/*`: app-specific auth/token/session behavior.
- `abzed-utils`: reusable UI/hooks/utils with no app-specific redirects.
- `src/actions/*`: API mutation/query definitions only.
- `src/components/*`: presentational and layout composition.

## Quality Gate

Before merge:

1. `npm run format:check`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

Or run `npm run check`.

## State and Data

- Server state: React Query.
- App/session state: Redux slices.
- Keep network side effects out of component render paths.

## Error Handling

- Prefer consistent backend error extraction.
- Use shared notify helpers for user-facing feedback.
- Keep redirect side effects in services.
