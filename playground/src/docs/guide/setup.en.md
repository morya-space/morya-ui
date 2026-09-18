---
title: One-shot setup
order: 3
description: Use @morya-ui/setup to install the library and optionally write styles, Agent config, and MCP.
---

# One-shot setup

[`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) onboards a consumer Vue app to `morya-ui`: install the dependency, inject styles, and optionally write the Agent skill, Cursor rules, and MCP. For manual install see [Quick start](/docs/quick-start). For AI page-generation workflow see [AI setup](/docs/ai-setup).

## Commands

From the app project root:

```bash
npx @morya-ui/setup
```

By default this will:

1. Install `morya-ui` (pnpm / yarn / npm from the lockfile)
2. Copy `DESIGN.md`, Agent skill, Cursor rules, golden pages, and check scripts
3. Merge `.cursor/mcp.json` for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. Try to inject `import 'morya-ui/styles.css'` and write `morya-app-shell.css`
5. Add a `check:colors` script when missing

Other common commands:

```bash
# Library + styles only
npx @morya-ui/setup app

# AI config + MCP only (library already installed)
npx @morya-ui/setup ai
```

If MCP was written, **restart Cursor** (or reload MCP). Have the agent read `DESIGN.md` before generating pages.

## Options

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Target project root (default: cwd) |
| `--pm pnpm\|yarn\|npm` | Package manager |
| `--force` | Overwrite existing template files and the `morya-ui` MCP entry |
| `--dry-run` | Print actions only |
| `--skip-install` | Skip dependency install |
| `--skip-template` | Skip copying skill / rules / docs |
| `--skip-mcp` | Skip writing MCP config |
| `--skip-styles` | Skip styles import injection |
| `--skip-scripts` | Skip `package.json` scripts |

By default **existing files are not overwritten**; use `--force` to overwrite templates and the MCP entry.

Example: MCP only:

```bash
npx @morya-ui/setup ai --skip-template --skip-scripts
```

## What lands in the project

| Path | Role |
| --- | --- |
| `DESIGN.md` | Primary design brief for AI |
| `.agents/skills/morya-ui-pages/` | Page-generation Agent skill (see [Agent Skill](/docs/agent-skill)) |
| `.cursor/rules/` | Cursor always-on rules |
| `docs/`, `design-tokens/`, `src/examples/` | Index, golden pages, tokens |
| `scripts/check-raw-colors.mjs` | Raw color scan |
| `.cursor/mcp.json` | Cursor MCP (`npx -y @morya-ui/mcp`) |
| `src/styles/morya-app-shell.css` | Height chain (default command or `app`) |

Template source: [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit). The CLI does not call `app.use(MoryaUI)` or edit `App.vue`.

## Conflict policy

- Template files and `.cursor/rules/*`: skip if the destination exists (unless `--force`)
- `.cursor/mcp.json`: merge other servers; skip an existing `morya-ui` entry unless `--force`
- `check:colors`: add only if missing (unless `--force`)
- Styles: inject only when an entry is found and the import is not already present

## Next steps

- [Quick start](/docs/quick-start): component usage and a minimal example  
- [AI setup](/docs/ai-setup): how setup relates to Skill / MCP for AI page generation  
- [Agent Skill](/docs/agent-skill) · [Agent MCP](/docs/mcp)  
- [Components](/components): browse APIs and previews
