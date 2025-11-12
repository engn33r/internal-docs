---
id: deployment
title: Deployments
sidebar_label: Deployments
description: CI/CD flow for production and preview builds.
---

## Pipeline overview

1. **Lint & test** (future): run unit or link checks.
2. **Build**: `npm ci && npm run build`.
3. **Package**: upload the `build/` directory as the deployment artifact.
4. **Protect**: configure basic auth credentials (or GitHub OAuth) in the hosting platform.
5. **Release**: point the CDN/edge function to the new artifact.

## Preview environments

- Every pull request should produce a password-protected URL.
- Use the same credential pair as production or generate a temporary preview-specific account.
- Document preview URLs inside the PR description for reviewers.

## Production releases

- Triggered on merges to `main`.
- Use long-lived secrets stored in the hosting provider’s secret store (e.g., Netlify env vars, Vercel project secrets).
- Confirm the secure middleware is enabled before promoting the build.
