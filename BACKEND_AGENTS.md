# Backend Agent Guide

This companion agent file defines how backend services and APIs should be structured for projects generated from this template.

## Goals

- Keep frontend and backend contracts predictable.
- Make success, validation, auth, and failure paths explicit.
- Require implementation and tests to cover real-world scenarios, not only happy paths.

## Recommended Backend Structure

Use feature-first folders. Each feature should keep controller, service, validation, DTO/schema, repository/data access, and tests together.

```text
src/
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      auth.validation.ts
      auth.routes.ts
      auth.types.ts
      __tests__/
        auth.service.test.ts
        auth.controller.test.ts
        auth.integration.test.ts
    profile/
      profile.controller.ts
      profile.service.ts
      profile.repository.ts
      profile.validation.ts
      __tests__/
        profile.service.test.ts
        profile.integration.test.ts
    notifications/
      notifications.controller.ts
      notifications.service.ts
      notifications.repository.ts
      notifications.validation.ts
      __tests__/
        notifications.service.test.ts
        notifications.integration.test.ts
  shared/
    errors/
    middleware/
    utils/
    test/
```

## API Contract Rules

- Prefer `POST` for list, details, and mutations unless a simple public `GET` is clearly better.
- Use authenticated user context from token/session, not `usrId` in query string for protected routes.
- Validate every request before service logic runs.
- Return one shared response envelope for both success and failure-safe frontend parsing.

```json
{
    "success": true,
    "message": "Request successful",
    "data": {
        "result": {}
    },
    "total": 0,
    "targetUrl": null,
    "status": 200
}
```

- `data.result` may be an object, array, or `null`.
- List endpoints should keep `total` at the top level.
- Validation failures should still return a clear `message` plus field-level details in `data.result.errors` when available.

## Auth And Session Flows

Implement these flows explicitly:

- Login request OTP
- Register request OTP
- Verify OTP
- Resend OTP
- Forgot password request OTP
- Forgot password verify OTP
- Update password
- Refresh session
- Logout / revoke session

For each auth flow:

- Validate identity input format.
- Throttle repeated attempts.
- Expire OTPs.
- Invalidate used OTPs.
- Audit sensitive actions.
- Avoid leaking whether an account exists unless product requirements explicitly allow it.

## Error Handling Rules

- Map domain failures to stable error messages.
- Never leak stack traces or SQL/internal provider errors to clients.
- Use typed/domain errors in the service layer.
- Normalize infrastructure failures like timeout, DB down, queue failure, third-party failure, and expired session.
- Log enough context for debugging without logging secrets, passwords, OTPs, or tokens.

Recommended error categories:

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `UNAUTHORIZED`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `EXTERNAL_SERVICE_ERROR`
- `INTERNAL_ERROR`

## Validation Requirements

Always validate:

- required fields
- type and format
- enum/code values
- length ranges
- duplicate/conflict conditions
- entity ownership/access checks
- allowed state transitions

Examples:

- password strength
- phone/email normalization
- OTP length and expiry
- immutable IDs on update
- notification status transitions

## Required Test Coverage

Every backend feature should include:

- unit tests for service logic
- controller/handler tests for request/response mapping
- integration tests for DB/repository behavior
- auth/permission tests for protected routes
- validation tests for bad payloads
- error-path tests for dependency failures

## Scenario Test Matrix

Minimum scenarios for each endpoint:

1. success with valid payload
2. missing required field
3. invalid field format/type
4. unauthorized request
5. forbidden request for wrong role/scope
6. entity not found
7. duplicate/conflict case
8. stale/expired token or OTP
9. dependency failure such as DB/email/SMS provider timeout
10. idempotent retry behavior where applicable

Auth-specific scenarios:

1. valid login OTP request
2. unknown account or masked response behavior
3. resend before cooldown expires
4. verify with expired OTP
5. verify with wrong OTP
6. verify after OTP already used
7. password update with weak password
8. refresh with expired or revoked session

Notification/profile scenarios:

1. fetch empty state
2. fetch populated state
3. update valid status
4. update invalid status transition
5. update entity owned by another tenant/user

## Implementation Notes For This Template

The frontend template expects action objects shaped like this:

```js
{
  method: "POST",
  endpoint: "/auth/sign_in",
  mutationFn,
  onError,
  onSuccess,
  invalidateQueryKeys,
}
```

Query actions should expose:

```js
{
  method: "POST",
  endpoint: "/notifications/list",
  queryKey,
  requestFn,
  queryFn,
}
```

Keep backend routes and payloads stable so frontend `useDynamicMutation`, `usePaginatedQuery`, and `useFormMutation` can stay thin.
