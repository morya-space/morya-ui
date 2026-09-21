# @morya-ui/setup

One-shot setup for consumer Vue projects using [`morya-ui`](https://www.npmjs.com/package/morya-ui).

Docs (zh/en):

- [One-shot setup](https://morya-space.github.io/morya-ui/docs/setup) — CLI commands and options
- [AI setup](https://morya-space.github.io/morya-ui/docs/ai-setup) — Agent workflow
- [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill) — `morya-ui-pages` behavior
- [Quick start](https://morya-space.github.io/morya-ui/docs/quick-start) — install and first component

Installs the UI library, copies Agent skills / Cursor rules / design docs from `design-kit`, merges Cursor MCP for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp), and injects `import 'morya-ui/styles.css'`.

## Usage

In your app project root:

```bash
npx @morya-ui/setup
```

On a TTY, `full` / `ai` will prompt for optional Agent skills (required `morya-ui-pages` is always included).

Other common commands:

```bash
# AI config + MCP only (library already installed)
npx @morya-ui/setup ai

# Library + styles only
npx @morya-ui/setup app

# Non-interactive skill selection
npx @morya-ui/setup ai --yes
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design
npx @morya-ui/setup ai --skills=all
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
| `--skip-install` | Do not install `morya-ui` |
| `--skip-template` | Do not copy AI skill / rules / docs |
| `--skip-mcp` | Do not write `.cursor/mcp.json` |
| `--skip-styles` | Do not inject `styles.css` |
| `--skip-scripts` | Do not add `check:colors` to `package.json` |
| `-h`, `--help` | Show help |

### Skills

| Id | Default | Role |
| --- | --- | --- |
| `morya-ui-pages` | required | Page generation with `M*` + golden layouts |
| `frontend-design` | optional | Express / brand visual taste |
| `fixing-accessibility` | optional | A11y audit and targeted fixes |

Catalog: [`catalog/skills.json`](./catalog/skills.json).

### Conflict policy

- Template files and `.cursor/rules/*`: **skip** if the destination exists (unless `--force`).
- `.cursor/mcp.json`: merge other servers; skip existing `morya-ui` entry unless `--force`.
- `package.json` `check:colors`: add only if missing (unless `--force`).
- Styles: inject only when an entry file is found and the import is not already present.

### What gets copied

From the package `template/` (synced from repo `design-kit/`):

- `DESIGN.md` — core design contract (principles, tokens, bans)
- `.agents/skills/<selected>/` — at least `morya-ui-pages`
- `.cursor/rules/`
- `scripts/check-raw-colors.mjs`

### MCP (Cursor)

Writes / merges:

```json
{
  "mcpServers": {
    "morya-ui": {
      "command": "npx",
      "args": ["-y", "@morya-ui/mcp"]
    }
  }
}
```

Restart Cursor (or reload MCP) after install.
