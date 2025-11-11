---
id: writing-playbook
title: Writing Playbook
sidebar_label: Writing playbook
description: Content conventions for Yearn internal docs.
---

## Structure

- Group related topics inside folders (e.g., `operations/`, `security/`).
- Name files with kebab-case and keep titles short.
- Prefer Markdown; switch to MDX only when embedding React components or live code blocks.

## Front matter

Every doc should include:

```md
---
id: short-id
title: Clear Title
description: One sentence summary for search.
---
```

## Style guidelines

- Assume the reader already has Yearn context; focus on actionable steps.
- Highlight secrets or credentials in callouts and keep them out of version control.
- Use ordered lists for runbooks and include verification steps.
- Link to dashboards, Grafana panels, or playbooks using plain URLs (no embedded iframes).

## Reviewing changes

1. Run `npm start` for live preview.
2. Request a teammate from the owning pod to review.
3. Ensure the PR description mentions any new secrets or infra toggles.
4. After merge, confirm the preview + production deploys finish successfully.
