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

### `POST /auth/sign_in`

Purpose:

- submit login credentials and start OTP verification

Expected request:

```json
{
    "usrEmail": "user@example.com",
    "usrSecret": "password"
}
```

Expected result payload:

```json
{
    "usrId": "USR123"
}
```

Frontend behavior:

- stores `usrId` in auth slice
- routes to `ROUTES.AUTH.LOGIN_OTP_VERIFICATION`

### `POST /auth/sign_up`

Purpose:

- create an account and start registration OTP verification

Expected request:

```json
{
    "usrFirstName": "Jane",
    "usrLastName": "Doe",
    "usrEmail": "jane@example.com",
    "usrMobileNumber": "+254700000000",
    "usrSecret": "Password@123"
}
```

Expected result payload:

```json
{
    "usrId": "USR123"
}
```

Frontend behavior:

- stores `usrId`
- routes to `ROUTES.AUTH.REGISTRATION_VERIFICATION`

### `POST /auth/sign_in_otp`

Purpose:

- verify OTP for login or registration

Expected request:

```json
{
    "usrId": "USR123",
    "usrOTP": "123456"
}
```

Expected result payload:

```json
{
    "accessToken": "jwt-or-token-value",
    "user": {
        "usrId": "USR123",
        "usrEmail": "user@example.com",
        "usrFullName": "Jane Doe",
        "usrRoleCode": "ADMIN"
    }
}
```

Frontend behavior:

- saves token
- hydrates auth state
- routes to dashboard

### `POST /auth/resend_otp`

Purpose:

- resend OTP for active auth flow

Expected request:

```json
{
    "usrId": "USR123"
}
```

### `POST /auth/reset_password`

Purpose:

- start forgot-password flow

Expected request:

```json
{
    "usrEmail": "user@example.com"
}
```

Expected result payload:

```json
{
    "usrId": "USR123"
}
```

Frontend behavior:

- stores `usrId`
- routes to forgot-password verification

### `POST /auth/update_password`

Purpose:

- save a new password after verification

Expected request:

```json
{
    "usrId": "USR123",
    "usrEncryptedPassword": "Password@123"
}
```

Frontend behavior:

- shows success toast
- redirects to login

### `POST /auth/refresh-session`

Purpose:

- refresh the current session when token is near expiry

Expected result payload:

```json
{
    "token": "new-jwt-or-access-token"
}
```

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

## Backend Expectations

- validate all inputs server-side even when the frontend validates first
- do not trust client-supplied `usrId` for protected flows unless the flow is explicitly pre-auth
- expire OTPs and prevent reuse
- keep success and failure messages human-readable
- avoid returning internal stack traces or raw provider errors
