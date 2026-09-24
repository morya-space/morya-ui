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
2. Copy `DESIGN.md`, Agent skill, Cursor rules, and check scripts
3. Merge `.cursor/mcp.json` for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. Try to inject `import 'morya-ui/styles.css'`
5. Add a `check:colors` script when missing

Other common commands:

```bash
# Library + styles only
npx @morya-ui/setup app

# AI config + MCP only (library already installed)
npx @morya-ui/setup ai

# Non-interactive skill selection
npx @morya-ui/setup ai --yes
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,impeccable
npx @morya-ui/setup ai --skills=all
```

On a TTY, `full` / `ai` prompts for optional Agent skills (required `morya-ui-pages` is always included). Optional companions are installed at **latest** via the [skills CLI](https://skills.sh/). If MCP was written, **restart Cursor** (or reload MCP). Have the agent read `DESIGN.md` before generating pages.

## Options

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Target project root (default: cwd) |
| `--pm pnpm\|yarn\|npm` | Package manager |
| `--skills <list>` | Comma-separated skill ids, or `all` (skips the prompt) |
| `--yes` / `-y` | Use default skills without prompting |
| `--force` | Overwrite existing template files and the `morya-ui` MCP entry |
| `--dry-run` | Print actions only |
| `--skip-install` | Skip dependency install |
| `--skip-template` | Skip copying skill / rules / docs (also skips companion install) |
| `--skip-mcp` | Skip writing MCP config |
| `--skip-styles` | Skip styles import injection |
| `--skip-scripts` | Skip `package.json` scripts |

Template files are **not** overwritten by default; use `--force` for templates and the MCP entry. Selected companion skills always refresh to latest.

### Skills

| Id | Default | Install | Role |
| --- | --- | --- | --- |
| `morya-ui-pages` | required | package template | Page generation with `M*` + golden layouts |
| `frontend-design` | optional | skills CLI (`anthropics/skills`, latest) | Express / brand visual taste |
| `fixing-accessibility` | optional | skills CLI (`ibelick/ui-skills`, latest) | A11y audit and targeted fixes |
| `impeccable` | optional | skills CLI (`pbakaus/impeccable`, latest) | Named polish / audit / redesign |

Catalog: [`packages/setup/catalog/skills.json`](https://github.com/morya-space/morya-ui/blob/main/packages/setup/catalog/skills.json).

Example: MCP only:

```bash
npx @morya-ui/setup ai --skip-template --skip-scripts
```

## What lands in the project

| Path | Role |
| --- | --- |
| `DESIGN.md` | Primary design brief (principles, app root, token summary, bans) |
| `.agents/skills/morya-ui-pages/` | Page-generation Agent skill (see [Agent Skill](/docs/agent-skill)) |
| `.agents/skills/<optional>/` | Latest companion skills via skills CLI when selected |
| `.cursor/rules/` | Cursor always-on rules |
| `scripts/check-raw-colors.mjs` | Raw color scan |
| `.cursor/mcp.json` | Cursor MCP (`npx -y @morya-ui/mcp`) |

Template source: [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit). The CLI does not call `app.use(MoryaUI)` or edit `App.vue`.

## Conflict policy

- Template files and `.cursor/rules/*`: skip if the destination exists (unless `--force`)
- Companion skills (skills CLI): always install/update to latest when selected
- `.cursor/mcp.json`: merge other servers; skip an existing `morya-ui` entry unless `--force`
- `check:colors`: add only if missing (unless `--force`)
- Styles: inject only when an entry is found and the import is not already present

## Next steps

- [Quick start](/docs/quick-start): component usage and a minimal example  
- [AI setup](/docs/ai-setup): how setup relates to Skill / MCP for AI page generation  
- [Agent Skill](/docs/agent-skill) · [Agent MCP](/docs/mcp)  
- [Components](/components): browse APIs and previews
