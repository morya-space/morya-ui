# @morya-ui/setup

One-shot setup for consumer Vue projects using [`morya-ui`](https://www.npmjs.com/package/morya-ui).

Docs (zh/en):

- [One-shot setup](https://morya-space.github.io/morya-ui/docs/setup) — CLI commands and options
- [AI setup](https://morya-space.github.io/morya-ui/docs/ai-setup) — Agent workflow
- [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill) — `morya-ui-pages` behavior
- [Quick start](https://morya-space.github.io/morya-ui/docs/quick-start) — install and first component

Installs / upgrades the UI library and any existing `@morya-ui/*` packages to **latest**, copies first-party Agent skills / Cursor rules / design docs from `design-kit`, installs optional companion skills at **latest** via the [skills CLI](https://skills.sh/), merges Cursor MCP for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp), and injects `import 'morya-ui/styles.css'`.

## Usage

In your app project root:

```bash
npx @morya-ui/setup
```

On a TTY, `full` / `ai` will prompt for optional Agent skills (required `morya-ui-pages` is always included).

Other common commands:

```bash
# Upgrade deps + AI config + MCP (skips styles injection)
npx @morya-ui/setup ai

# Upgrade deps + styles only
npx @morya-ui/setup app

# Non-interactive skill selection
npx @morya-ui/setup ai --yes
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,impeccable
npx @morya-ui/setup ai --skills=all

# Refresh AI template / MCP without touching dependencies
npx @morya-ui/setup ai --skip-install
```

### Options

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Target project root (default: current directory) |
| `--pm pnpm\|yarn\|npm` | Package manager (default: detect from lockfile, else `pnpm`) |
| `--skills <list>` | Comma-separated skill ids, or `all` (skips the prompt) |
| `--yes` / `-y` | Use default skills without prompting |
| `--force` | Overwrite existing template files and the `morya-ui` MCP entry |
| `--dry-run` | Print actions without writing or installing |
| `--skip-install` | Do not install / upgrade `morya-ui` or `@morya-ui/*` |
| `--skip-template` | Do not copy AI skill / rules / docs (also skips companion skill install) |
| `--skip-mcp` | Do not write `.cursor/mcp.json` |
| `--skip-styles` | Do not inject `styles.css` |
| `--skip-scripts` | Do not add `check:colors` to `package.json` |
| `-h`, `--help` | Show help |

### Skills

| Id | Default | Install | Role |
| --- | --- | --- | --- |
| `morya-ui-pages` | required | template (from this package) | Page generation with `M*` + snippets / decisions (composition-first) |
| `frontend-design` | optional | skills CLI → `anthropics/skills` (latest) | Express / brand visual taste |
| `fixing-accessibility` | optional | skills CLI → `ibelick/ui-skills` (latest) | A11y audit and targeted fixes |
| `impeccable` | optional | skills CLI → `pbakaus/impeccable` (latest) | Named polish / audit / redesign passes |

Catalog: [`catalog/skills.json`](./catalog/skills.json).

### Conflict policy

- Dependencies: always install / upgrade `morya-ui@latest` and any existing `@morya-ui/*` (e.g. `@morya-ui/nuxt`) to `@latest` unless `--skip-install`.
- Template files and `.cursor/rules/*`: **skip** if the destination exists (unless `--force`).
- Companion skills (`skills-cli`): always reinstall/update to **latest** when selected.
- `.cursor/mcp.json`: merge other servers; skip existing `morya-ui` entry unless `--force`. New or forced entries use `npx -y @morya-ui/mcp@latest`.
- `package.json` `check:colors`: add only if missing (unless `--force`).
- Styles: inject only when an entry file is found and the import is not already present.

### What gets copied / installed

From the package `template/` (synced from repo `design-kit/`):

- `DESIGN.md` — core design contract (principles, tokens, bans)
- `.agents/skills/morya-ui-pages/` — first-party page skill
- `.cursor/rules/`
- `scripts/check-raw-colors.mjs`

Via `npx skills add …` when optional companions are selected:

- `.agents/skills/frontend-design/`, `fixing-accessibility/`, and/or `impeccable/` (latest upstream)

### MCP (Cursor)

Writes / merges:

```json
{
  "mcpServers": {
    "morya-ui": {
      "command": "npx",
      "args": ["-y", "@morya-ui/mcp@latest"]
    }
  }
}
```

Restart Cursor (or reload MCP) after install.
