---
id: local-development
title: Local Development
sidebar_label: Local dev guide
description: Steps to run and validate the gated docs experience locally.
---

## Prerequisites

- Node.js 20+
- npm 10+
- Access to this repo

## Install dependencies

```bash
npm install
```

Dependencies are vendored in `package-lock.json` for reproducible builds.

## Edit docs with hot reload

```bash
npm start
```

This launches the standard Docusaurus dev server on port 3000. It does **not** enforce auth so contributors can iterate quickly.

## Test the gated build locally

1. Build the static site:
   ```bash
   npm run build
   ```
2. Provide credentials (temporary examples shown below):
   ```bash
   DOCS_BASIC_AUTH_USERS="alice:test" npm run serve:secure
   ```
3. Visit `http://localhost:4173` and log in with the username/password pair you set.

The secure server reads the `build/` output and requires HTTP basic auth before serving files, mirroring production behavior.
