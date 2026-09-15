---
title: AI setup
order: 9
description: One-shot install of the library, Agent skill, Cursor rules, and MCP via @morya-ui/setup.
---

# AI setup

For **AI-assisted page generation** in consumer apps. Prefer [`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) to install the library and AI config together. Hand-written apps can still use only `pnpm add morya-ui`.

## One command

From the app project root:

```bash
npx @morya-ui/setup
```

This will:

1. Install `morya-ui` (pnpm / yarn / npm from the lockfile)
2. Copy `DESIGN.md`, Agent skill, Cursor rules, golden pages, and check scripts
3. Merge `.cursor/mcp.json` for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. Try to inject `import 'morya-ui/styles.css'` into the app entry
5. Add a `check:colors` script when missing

Then **restart Cursor** (or reload MCP). Have the agent read `DESIGN.md` before generating pages.

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

Example: MCP only, library already installed:

```bash
npx @morya-ui/setup --skip-install --skip-template --skip-styles --skip-scripts
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

Template source: [`ai-design-config/`](https://github.com/morya-space/morya-ui/tree/main/ai-design-config). CLI details: [`packages/setup`](https://github.com/morya-space/morya-ui/tree/main/packages/setup).

## Relation to Skill / MCP

- **Setup**: one-shot project onboarding (library + AI config)
- **[Agent Skill](/docs/agent-skill)**: on-demand guidance for building pages with `morya-ui`
- **MCP**: runtime doc lookup for AI clients

Tools and multi-client configs: [Agent MCP](/docs/mcp). You can configure MCP by hand from that page without running setup.

## Next steps

- [Agent Skill](/docs/agent-skill): when to use `morya-ui-pages`, surface map
- [Agent MCP](/docs/mcp): tools and client config
- [Quick start](/docs/quick-start): manual install and a minimal example
- [Components](/components): browse APIs and previews