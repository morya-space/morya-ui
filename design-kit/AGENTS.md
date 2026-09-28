# AGENTS — morya-ui consumer projects

Editor-neutral always-on guidance for AI agents (Cursor, VS Code, Zed, Copilot, CLI agents). Cursor also ships `.cursor/rules/`; this file is the portable subset.

## Before generating or editing UI

1. Read project-root `DESIGN.md` (design contract).
2. Prefer skill `.agents/skills/morya-ui-pages/` for page workflows.
3. Prefer MCP `@morya-ui/mcp` for real Props / Events / snippets — never invent API names.

## Hard rules

1. Use only `morya-ui` `M*` components; global styles `morya-ui/styles.css`.
2. Colors / spacing / radius use `--m-*` CSS variables — no raw hex/rgb in business UI (see `scripts/check-raw-colors.mjs`). Brand differences go in theme overrides (`--m-color-primary`, fonts) per `DESIGN.md`.
3. **Composition-first**: with a reference, call MCP `map_reference` (or `recommend_page` + `brief` / `density`) → assemble via `get_page_snippet` from `mapping` / `suggestedSnippets`. Use `page-layouts` as a block-order checklist. `get_golden_page` is optional. Account / Express / Flow signature shells: `get_style_shells`.
4. **Visual direction**: clear reference/description → follow the user; clear cues → infer and say so; unsure → ask (`get_style_direction`). There is no named style-preset table. Do not apply default AI gradients / neon / glass without asking.
5. Form options: `MSelect` / `MTreeSelect`. Action menus: `MDropdown`.
6. Uncertain API → docs site or MCP `get_component`. After writing code: `validate_usage`.
7. Root: `MConfigProvider`. Admin chrome: `MLayout` family.
8. Feedback defaults to `message` API; use `toast` only for summary + detail or async feel; persistent form errors use field `errorMessage` or token-styled `role="alert"`.
9. Before delivery: `validate_page` with the same `brief` — contract `ok` must be true; craft suggestions may be waived with a short note.

## MCP / skills map

| Need | Use |
| --- | --- |
| Page plan + snippets | `recommend_page`, `map_reference`, `get_page_snippet` |
| Signature shells | `get_style_shells` |
| Tokens / composition | `get_design_rules` |
| Component pick | `recommend_component`, `get_component`, `get_example` |
| Offline recipes | skill `references/` under `morya-ui-pages` |

Setup writes editor MCP configs (Cursor / VS Code / Zed) and root `.mcp.json`. Reload MCP after `npx @morya-ui/setup ai`.
