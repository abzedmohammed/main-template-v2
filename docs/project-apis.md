# Project APIs

This template now uses the newer foldered action structure:

```text
src/actions/
  auth/
    actions.js
    helpers.js
    index.js
  admin/
    actions.js
    fetchActions.js
    helpers.js
    queryKeys.js
    index.js
  index.js
```

## Frontend Action Contract

Mutation actions should expose:

```js
{
  method: 'POST',
  endpoint: '/auth/sign_in',
  mutationFn,
  onError,
  onSuccess,
  invalidateQueryKeys,
}
```

Query actions should expose:

```js
{
  method: 'GET' | 'POST',
  endpoint: '/fetch_in_app_notification',
  queryKey,
  requestFn,
  queryFn,
}
```

This shape is consumed by `useDynamicMutation`, `usePaginatedQuery`, and `useFormMutation`.

## Response Envelope

Preferred backend response envelope:

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

Notes:

- `data.result` may be an object, array, or `null`
- list endpoints should return `total` at the top level
- error responses should keep `message` stable and actionable

## Auth Endpoints In Template

Mirrors the backend contract in `main-java-template/docs/project-apis.md`. OTP-based, multi-step, stateless JWT: sign-up / sign-in / reset start a flow, a 4-digit OTP verifies it, and the access token is sent as `Authorization: Bearer <token>` (no cookies, no refresh tokens).

Auth credential fields are intentionally **un-prefixed** (`email`, `secret`, `password`, `fullName`, `phone`, `agreement`, `otp`); the flow id is `reqId` in every step.

```
register ─▶ /auth/sign_up        ─▶ OTP ─▶ /auth/sign_in_otp ─▶ session
login    ─▶ /auth/sign_in        ─▶ OTP ─▶ /auth/sign_in_otp ─▶ session
forgot   ─▶ /auth/reset_password ─▶ OTP ─▶ /auth/sign_in_otp ─▶ /auth/update_password
```

### Init response (`sign_up`, `sign_in`, `reset_password`)

```json
{ "reqId": "0190a1b2-...", "maskedEmail": "ja****@example.com", "otpTimer": 5 }
```

Frontend behavior:

- `readOtpFlow` stores `{ reqId, maskedEmail, otpTimer }` in `state.auth.otpFlow` (`otpFlowStateFn`)
- OTP screens guard on `otpFlow.reqId` (redirect to login without it) and show "Enter the code sent to `maskedEmail`"
- resend countdown = `otpTimer × 60` seconds, falling back to `VITE_DEFAULT_TIMER`

### `POST /auth/sign_in`

```json
{ "email": "jane@example.com", "secret": "Password@123" }
```

Returns the init response → routes to `ROUTES.AUTH.LOGIN_OTP_VERIFICATION`. Errors: 401 bad credentials / "Please verify account before continuing", 403 deactivated, 429 locked.

### `POST /auth/sign_up`

```json
{
    "fullName": "Jane Doe",
    "phone": "+254712345678",
    "email": "jane@example.com",
    "password": "Password@123",
    "agreement": true
}
```

- `phone` is E.164 (from `FormInputPhone`)
- `agreement` must be `true` (backend `@AssertTrue`); the form enforces it with a checkbox validator

Returns the init response → routes to `ROUTES.AUTH.REGISTRATION_VERIFICATION`. 409 when the email / mobile number belongs to a non-`DRAFT` account. New accounts get role `USER`.

### `POST /auth/sign_in_otp`

```json
{ "reqId": "0190a1b2-...", "otp": "1234" }
```

Login / registration result:

```json
{
    "accessToken": "eyJ...",
    "user": {
        "usrId": "0190a1b2-...",
        "usrEmail": "jane@example.com",
        "usrFullName": "Jane Doe",
        "usrMobileNumber": "0712345678",
        "usrRoleCode": "USER"
    }
}
```

Frontend behavior:

- saves `accessToken` via `tokenService.set`
- hydrates `state.auth.user` (JWT claims `sub`, `email`, `name`, `role`, `exp` merged under the `user` fields)
- `state.auth.userRole` = `user.usrRoleCode`, falling back to the JWT `role` claim; clears `otpFlow`
- routes to the dashboard

Reset flow: `data.result` is `null` → routes to `ROUTES.AUTH.UPDATE_PASSWORD`, keeping `otpFlow.reqId`. Errors: 400 invalid/expired, 429 too many wrong attempts.

### `POST /auth/resend_otp`

```json
{ "reqId": "0190a1b2-..." }
```

`data.result` is `null`; the countdown restarts.

### `POST /auth/reset_password`

```json
{ "email": "jane@example.com" }
```

Returns the init response (unknown emails still succeed — no enumeration) → routes to `ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION`.

### `POST /auth/update_password`

```json
{ "reqId": "0190a1b2-...", "password": "NewPassword@123" }
```

Authorized by a reset OTP verified in the last 15 minutes (401 otherwise). The frontend validates strength + confirmation first; on success it clears `otpFlow` and redirects to login.

### `POST /auth/refresh-session`

Authenticated (Bearer), no body. Result:

```json
{ "token": "eyJ..." }
```

`refreshSessionAction` stores the new token (which also restarts the client session window).

## Admin/Profile Endpoints In Template

### `POST /save`

Purpose:

- update the authenticated user profile

Expected request:

```json
{
    "usrId": "USR123",
    "usrEmail": "user@example.com",
    "usrMobileNumber": "+254700000000",
    "usrSecretOld": "OldPassword@123",
    "usrSecret": "NewPassword@123",
    "usrSecretConfirm": "NewPassword@123"
}
```

Frontend validation before submit:

- current password required when changing password
- password strength enforced
- new password and confirmation must match

### `GET /fetch_in_app_notification`

Purpose:

- fetch notification list used by `MainLayout`

Expected result payload:

```json
[
    {
        "notId": "NOT001",
        "notMessage": "New notification",
        "notStatus": "NEW"
    }
]
```

### `PUT /update_in_app_notification`

Purpose:

- update notification status after opening/displaying it

Expected request:

```json
{
    "notId": "NOT001",
    "notStatus": "UNREAD"
}
```

## Delete Endpoint In Template

### `DELETE /api/delete/{id}`

Purpose:

- delete a record by id — the only non-`POST` endpoint in the contract

Request:

- no body; the id travels in the path (URL-encoded)
- frontend builds it with `createMutationAction({ path: '/api/delete/{id}', method: 'DELETE', mapPayload })`, which fills `{id}` from the mutation payload (after `mapPayload`) and throws before sending if it is missing

Expected response:

```json
{
    "success": true,
    "message": "Record deleted successfully",
    "data": null,
    "total": 0,
    "targetUrl": null,
    "status": 200
}
```

- `success: false` is treated as a failure and routed to `onError` with the envelope `message`

## Backend Expectations

- validate all inputs server-side even when the frontend validates first
- do not trust client-supplied `usrId` for protected flows unless the flow is explicitly pre-auth
- expire OTPs and prevent reuse
- keep success and failure messages human-readable
- avoid returning internal stack traces or raw provider errors
