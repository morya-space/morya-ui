---
title: Agent Skill
order: 12
description: Consumer morya-ui-pages skill — when it triggers, vs rules/MCP, and the surface map.
---

# Agent Skill

When AI generates **morya-ui consumer pages**, load the **`morya-ui-pages`** skill. It defines the component contract, surface types, and workflow. It is **not** for authoring new components inside the library source.

Install via [One-shot setup](/docs/setup) (`npx @morya-ui/setup` copies it into the project); AI workflow: [AI setup](/docs/ai-setup). This page explains **what it is, when to use it, and how it relates to other config**.

## Where it lives

```text
.agents/skills/morya-ui-pages/
├── SKILL.md
└── references/          # layouts, surfaces, tokens, feedback, checklist, …
```

Clients that auto-discover Agent Skills (e.g. Cursor) read `.agents/skills`. Prefer this skill before generating list / form / login / landing pages.

Source: [`design-kit/.agents/skills/morya-ui-pages/`](https://github.com/morya-space/morya-ui/tree/main/design-kit/.agents/skills/morya-ui-pages), synced into the `@morya-ui/setup` template. Optional companions (`frontend-design`, `fixing-accessibility`) can be installed with `npx @morya-ui/setup ai --skills=…` — see [One-shot setup](/docs/setup).

## When it triggers

Typical topics:

- `morya-ui`, `M*` components, `--m-*` tokens, golden pages
- Admin list / form / dashboard / detail / settings
- Login / register / empty state / wizard / landing / marketing site

**Prefer over** generic `frontend-design`, Impeccable, or UI-UX-Pro-Max when the stack is morya-ui — those may inform taste only.

**Do not** use for backend-only work or for adding components under this repo’s `src/components`.

## How it relates to other config

| Layer | Role |
| --- | --- |
| [One-shot setup](/docs/setup) / `@morya-ui/setup` | One-shot install of library + skill + rules + MCP |
| [AI setup](/docs/ai-setup) | How to use the Agent after install |
| **`morya-ui-pages` skill** | On-demand workflow: pick surface, golden pages, compose `M*`, review |
| `.cursor/rules/` | Always-on short editor rules |
| `DESIGN.md` | Project design source of truth; wins over skill on conflict |
| [Agent MCP](/docs/mcp) | Runtime lookup of real props / events / examples |

Two layers always apply:

1. **Contract** — only `M*` and `--m-*`; APIs from MCP / docs  
2. **Craft** — pick the surface first; Ops stays restrained; Express may take intentional aesthetic risk on-token and on-component

## Surface map

| Lane | Surfaces | Prefer |
| --- | --- | --- |
| **Ops** | list, form, dashboard, detail, settings, filter drawer | Golden pages + skill `page-layouts` |
| **Account** | login, register, invite, reset password, profile | skill `surfaces` § Account |
| **Flow** | onboarding, empty, wizard, success | skill `surfaces` § Flow |
| **System** | 404, permission denied, maintenance | skill `surfaces` § System |
| **Express** | marketing landing, pricing, feature showcase | skill `surfaces` + `visual-craft` |
| **Overlay** | Dialog / Drawer / CommandMenu as the main UI | skill `surfaces` § Overlay |

Unclear brief → Ops → nearest golden page; public marketing → Express.

## Recommended agent workflow (summary)

1. Pin subject, audience, surface, and the first viewport’s single job  
2. Prefer MCP: `recommend_page` → `get_golden_page` → `get_component` / `get_example`  
3. Without MCP, read skill `references/` (layouts, surfaces, feedback)  
4. Feedback defaults to `message`; `toast` only for summary+detail / async feel. Persistent form errors use field `errorMessage` or a token-styled `role="alert"` — `<MMessage>` is not an inline alert. Table rows use `rows`. Always run a light craft pass before delivery (Ops polish / atmosphere — see skill `visual-craft`).  
5. Review with the skill checklist; run MCP `validate_page` when available  

Full rules and hard boundaries live in the project’s `SKILL.md` — this page does not duplicate it.

## Next steps

- [One-shot setup](/docs/setup): install the skill and related config  
- [AI setup](/docs/ai-setup): AI page-generation workflow  
- [Agent MCP](/docs/mcp): tools and client config  
- [Quick start](/docs/quick-start): manual library install  
- [Components](/components): browse APIs
