# Yearn Internal Docs

Yearn’s private documentation portal is built with [Docusaurus 3](https://docusaurus.io/) and bundled as static assets that are always served behind access control.

## Getting started

```bash
npm install
```

The repo uses `package-lock.json` for deterministic installs. Node.js 20+ is required.

## Authoring content

```bash
npm start
```

This runs the standard Docusaurus dev server (port 3000) with hot reload. Authentication is intentionally disabled in this mode so contributors can iterate quickly.

Add or edit Markdown/MDX files under `docs/` and update `sidebars.ts` when you introduce new top-level sections. See `docs/writing-playbook.md` for style guidance.

## Build and test the gated site

```bash
npm run build
DOCS_BASIC_AUTH_USERS=\"alice:test\" npm run serve:secure
```

1. `npm run build` outputs the production-ready site into `build/`.
2. `npm run serve:secure` starts an Express server that wraps the static output with HTTP basic auth. Provide credentials via the `DOCS_BASIC_AUTH_USERS` env variable as a comma-separated list of `username:password` pairs.

Visit `http://localhost:4173` and sign in with one of the provided credentials to confirm the gate works before deploying.

## Deploying

Production and preview deployments both follow the same steps:

1. `npm ci`
2. `npm run build`
3. Upload the `build/` directory to your hosting provider (Netlify, Vercel, Cloudflare Pages, or an internal bucket).
4. Configure access control at the edge using either the provided `serve:secure` server (Node/Express) or the host’s password-protection/middleware features.

Store secrets such as `DOCS_BASIC_AUTH_USERS` in the hosting platform’s secret store and rotate them regularly. See `docs/deployment.md` for CI/CD details.
