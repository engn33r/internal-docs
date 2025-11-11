---
id: access-control
title: Access Control
sidebar_label: Access Control
description: How the docs site enforces basic auth and optional GitHub allowlists.
---

Yearn limits access to this site behind HTTP basic authentication so credentials are required before any assets load.

## Basic Auth

| Variable | Purpose |
| --- | --- |
| `DOCS_BASIC_AUTH_USERS` | Comma-separated list of `username:password` pairs allowed to log in. |
| `DOCS_PORT` | Optional port override for the secure server (defaults to `4173`). |

- Credentials are injected via the hosting platform (Netlify/Vercel environment variables or secrets manager) and **never** committed to the repo.
- The secure server challenges every request with `WWW-Authenticate`. Assets are sent only after successful auth.
- Rotate credentials monthly or whenever someone leaves the project. Update CI secrets, redeploy, and announce in #internal-docs.

## Allowlist (Optional)

If you need to double-check GitHub usernames or team slugs, add them to `allowlist.json`. Hook this file into whatever identity provider guards the hosting layer (e.g., GitHub OAuth app or reverse proxy). The static site does not read this file directly today, but keeping it close to the codebase ensures the list and docs stay in sync.

```json title="allowlist.json"
{
  "githubUsers": ["yearn-engineer"],
  "githubTeams": ["yearn/security"]
}
```

## Preview & Production Parity

Both preview builds and the main production deployment must set the same `DOCS_BASIC_AUTH_USERS` so behavior is identical:

1. PR deploy -> apply password protection (Netlify Password, Vercel Middleware, or the provided `serve:secure` script).
2. Production deploy -> reuse the same middleware with rotated secrets.
3. GitHub OAuth (future) -> configure the OAuth client once and share the callback URL template with infra.

Document any deviations inside the deployment record before shipping.
