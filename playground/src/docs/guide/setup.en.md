---
title: One-shot setup
order: 3
description: Use @morya-ui/setup to install the library and optionally write styles, Agent config, and MCP.
---

# One-shot setup

[`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) onboards a consumer Vue app to `morya-ui`: install the dependency, inject styles, and optionally write the Agent skill, Cursor rules, portable `AGENTS.md`, and multi-editor MCP. For manual install see [Quick start](/docs/quick-start). For AI page-generation workflow see [AI setup](/docs/ai-setup).

## Commands

From the app project root:

```bash
npx @morya-ui/setup
```

By default this will:

1. Install / upgrade `morya-ui` and any existing `@morya-ui/*` (e.g. `@morya-ui/nuxt`) to npm `latest` (pnpm / yarn / npm from the lockfile)
2. Copy `DESIGN.md`, `AGENTS.md`, Agent skill, Cursor rules, and check scripts
3. Merge MCP configs (Cursor / VS Code / Zed + root `.mcp.json`) for [`@morya-ui/mcp@latest`](https://www.npmjs.com/package/@morya-ui/mcp)
4. Try to inject `import 'morya-ui/styles.css'`
5. Add a `check:colors` script when missing

Other common commands:

```bash
# Upgrade deps + styles only
npx @morya-ui/setup app

# Upgrade deps + AI config + MCP (skips styles injection)
npx @morya-ui/setup ai

# Non-interactive skill selection
npx @morya-ui/setup ai --yes
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,impeccable
npx @morya-ui/setup ai --skills=all

# Subset of MCP editor targets (still writes .mcp.json)
npx @morya-ui/setup ai --editors=cursor,vscode

# Narrow skill agents (default: cursor, github-copilot, zed, claude-code, windsurf)
npx @morya-ui/setup ai --agents=github-copilot,zed

# Install companions to every skills-CLI agent (many dirs)
npx @morya-ui/setup ai --agents=all

# Refresh AI template / MCP without touching dependencies
npx @morya-ui/setup ai --skip-install
```

On a TTY, `full` / `ai` prompts for optional Agent skills (required `morya-ui-pages` is always included). Optional companions are installed at **latest** via the [skills CLI](https://skills.sh/) for the default five skill agents, and mirrored into agent-specific dirs. If MCP was written, **restart your editor or reload MCP**. Zed may require trusting the worktree before project skills load. Have the agent read `DESIGN.md` (and `AGENTS.md`) before generating pages.

## Options

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Target project root (default: cwd) |
| `--pm pnpm\|yarn\|npm` | Package manager |
| `--skills <list>` | Comma-separated skill ids, or `all` (skips the prompt) |
| `--editors <list>` | MCP targets: `cursor`, `vscode`, `zed`, or `all` (default: all three; always also writes `.mcp.json`) |
| `--agents <list>` | Skill agents: `cursor`, `github-copilot`, `zed`, `claude-code`, `windsurf` (default), or `all` |
| `--yes` / `-y` | Use default skills without prompting |
| `--force` | Overwrite existing template files, MCP `morya-ui` entry, and skill-dir links |
| `--dry-run` | Print actions only |
| `--skip-install` | Skip install / upgrade of `morya-ui` and `@morya-ui/*` |
| `--skip-template` | Skip copying skill / rules / docs (also skips companion install) |
| `--skip-mcp` | Skip writing MCP config |
| `--skip-styles` | Skip styles import injection |
| `--skip-scripts` | Skip `package.json` scripts |

Template files are **not** overwritten by default; use `--force` for templates and the MCP entry. Selected companion skills always refresh to latest. Dependencies are bumped to latest by default; pass `--skip-install` to leave them alone.

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
| `AGENTS.md` | Portable always-on checklist (VS Code / Zed / CLI agents) |
| `.agents/skills/morya-ui-pages/` | Page-generation Agent skill (see [Agent Skill](/docs/agent-skill)) |
| `.agents/skills/<optional>/` | Latest companion skills via skills CLI when selected |
| `.claude/skills/`, `.windsurf/skills/`, `.github/skills/` | Mirrors from `.agents/skills` (Claude Code / Windsurf / Copilot) |
| `.cursor/rules/` | Cursor always-on rules |
| `scripts/check-raw-colors.mjs` | Raw color scan |
| `.cursor/mcp.json` | Cursor MCP |
| `.vscode/mcp.json` | VS Code MCP |
| `.zed/settings.json` | Zed `context_servers` (merged; other settings kept) |
| `.mcp.json` | Portable MCP (Agent Host / cross-tool discovery) |

Template source: [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit). The CLI does not call `app.use(MoryaUI)` or edit `App.vue`.

## Conflict policy

- Dependencies: always install / upgrade `morya-ui@latest` and any existing `@morya-ui/*` to `@latest` unless `--skip-install`
- Template files and `.cursor/rules/*`: skip if the destination exists (unless `--force`)
- Companion skills (skills CLI): always install/update to latest when selected
- MCP configs: merge other servers / settings; skip an existing `morya-ui` entry unless `--force`; new or forced entries use `@morya-ui/mcp@latest`
- `check:colors`: add only if missing (unless `--force`)
- Styles: inject only when an entry is found and the import is not already present

## Next steps

- [Quick start](/docs/quick-start): component usage and a minimal example  
- [AI setup](/docs/ai-setup): how setup relates to Skill / MCP for AI page generation  
- [Agent Skill](/docs/agent-skill) · [Agent MCP](/docs/mcp)  
- [Components](/components): browse APIs and previews
