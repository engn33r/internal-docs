# Internal Docs Platform Specification

## 1. Goal
Create a Docusaurus-based internal documentation site for Yearn that keeps all pages behind access control while remaining easy to host on standard static infrastructure.

## 2. Scope
- Source lives in this repo and uses Docusaurus (v3+).
- Docs build output is published to production and preview environments.
- All environments require authentication before serving any content.
- Authentication can use either HTTP basic auth or GitHub OAuth (via an existing internal OAuth app, if available).

## 3. Requirements

### 3.1 Documentation Experience
- Docusaurus classic template with docs + blog disabled (if unused) for faster build.
- Dark/light theme toggle and Yearn branding.
- Sidebar-driven navigation with search (Algolia DocSearch optional).
- Markdown files authored in `docs/`; MDX allowed for interactive content.
- Versioning disabled initially; structure should allow enabling later.

### 3.2 Access Control
- Primary mechanism: site sits behind HTTP basic auth with credentials managed outside the repo (e.g., environment variables in hosting platform).
- Optional enhancement: GitHub OAuth using an allowlist of org members/team slugs defined via config (JSON/YAML file in repo) and injected at runtime.
- Allowlist is a flat list of approved users/teams; no role-based branching inside the app.
- Both production and any preview (PR) deployments must enforce auth; unauthenticated users receive 401/403 responses before static assets are downloaded.

### 3.3 Hosting & Deployment
- Prefer static hosting (e.g., Netlify, Vercel, Cloudflare Pages) with edge functions or middleware to add auth.
- If static host cannot enforce auth easily, fall back to a lightweight Node/Express server serving the `build/` directory and handling auth.
- CI/CD pipeline:
  1. On push to main: install dependencies, run `yarn build`, upload `build/` output to hosting target.
  2. On PR: run same build, deploy to preview URL with identical auth.
- Secrets (basic auth credentials, OAuth client secrets, allowlist) managed via host/CI secret store; never committed.

### 3.4 Local Development
- Developers run `yarn install && yarn start` for local preview.
- Provide `.env.example` showing placeholders for basic-auth creds and optional GitHub OAuth settings.
- For local auth simulation, mock middleware that reads `.env` and blocks access.

### 3.5 Security & Compliance
- Enforce HTTPS everywhere; redirect HTTP to HTTPS in hosting config.
- Limit login attempts via hosting/platform basics (e.g., Netlify password protection or reverse proxy limits) if possible.
- Log access attempts only if the hosting provider offers it; no additional logging required.
- Document credential rotation process in README.

## 4. Architecture

| Layer | Responsibility |
| --- | --- |
| Docusaurus app | Markdown-to-React static site |
| Auth middleware | Basic auth check (plus optional GitHub OAuth flow) before serving static assets |
| Config | `.env` for secrets, `allowlist.json` for GitHub usernames/teams |
| CI/CD | Build + deploy pipeline ensuring auth config present in both preview and prod |

## 5. Implementation Plan
1. Scaffold Docusaurus with `npx create-docusaurus@latest internal-docs classic --typescript`.
2. Customize theme (logo, colors, footer links) and add initial doc structure.
3. Add environment-driven config loader for auth options.
4. Implement middleware:
   - Basic auth: wrap dev server and exported static host functions.
   - GitHub OAuth: optional Express/edge function that exchanges code, validates allowlist, sets encrypted session cookie.
5. Provide deployment recipes:
   - Netlify/Vercel: use built-in password protection or Middleware/Edge Functions for auth.
   - Self-hosted: run `node server.js` that serves `build/` behind Express middleware.
6. Document operational steps (build, deploy, rotating passwords) in README.

## 6. Deliverables
- Docusaurus project with sample docs.
- Auth middleware code with configuration docs.
- `.env.example`, `allowlist.json` template, and README instructions.
- CI configuration (e.g., GitHub Actions) that builds and deploys with auth enabled for main + previews.

## 7. Open Items / Decisions
- Confirm whether GitHub OAuth will be used immediately or kept as a future enhancement.
- Confirm hosting provider preference to tailor middleware (Netlify vs Vercel vs custom).
- Determine who owns credential rotation and allowlist updates.
