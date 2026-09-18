# @morya-ui/setup

One-shot setup for consumer Vue projects using [`morya-ui`](https://www.npmjs.com/package/morya-ui).

Docs (zh/en):

- [One-shot setup](https://morya-space.github.io/morya-ui/docs/setup) — CLI commands and options
- [AI setup](https://morya-space.github.io/morya-ui/docs/ai-setup) — Agent workflow
- [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill) — `morya-ui-pages` behavior
- [Quick start](https://morya-space.github.io/morya-ui/docs/quick-start) — install and first component

Installs the UI library, copies Agent skill / Cursor rules / design docs from `design-kit`, merges Cursor MCP for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp), injects `import 'morya-ui/styles.css'`, and writes `src/styles/morya-app-shell.css` with its entry import.

## Usage

In your app project root:

```bash
npx @morya-ui/setup
```

Other common commands:

```bash
# AI config + MCP only (library already installed)
npx @morya-ui/setup ai

# Library + styles only
npx @morya-ui/setup app
```

### Options

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Target project root (default: current directory) |
| `--pm pnpm\|yarn\|npm` | Package manager (default: detect from lockfile, else `pnpm`) |
| `--force` | Overwrite existing template files and the `morya-ui` MCP entry |
| `--dry-run` | Print actions without writing or installing |
| `--skip-install` | Do not install `morya-ui` |
| `--skip-template` | Do not copy AI skill / rules / docs / tokens |
| `--skip-mcp` | Do not write `.cursor/mcp.json` |
| `--skip-styles` | Do not inject `styles.css` / write app-shell CSS |
| `--skip-scripts` | Do not add `check:colors` to `package.json` |
| `-h`, `--help` | Show help |

Example: MCP only:

```bash
npx @morya-ui/setup ai --skip-template --skip-scripts
```

### Conflict policy

- Template files and `.cursor/rules/*`: **skip** if the destination exists (unless `--force`).
- `.cursor/mcp.json`: merge other servers; skip existing `morya-ui` entry unless `--force`.
- `package.json` `check:colors`: add only if missing (unless `--force`).
- Styles: inject only when an entry file is found and the import is not already present.

### What gets copied

From the package `template/` (synced from repo `design-kit/`):

- `DESIGN.md`
- `.agents/skills/morya-ui-pages/`
- `.cursor/rules/`
- `docs/` (component index, golden pages, feedback guide)
- `design-tokens/`
- `scripts/check-raw-colors.mjs`
- `src/examples/`

`morya-app-shell.css` is written by the CLI (not copied from the template tree).

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

Restart Cursor (or reload MCP) after setup.

Other clients can use the same stdio command; this CLI only writes `.cursor/mcp.json`.

### Styles

Looks for `src/main.ts` / `.js` / `.tsx` / `.jsx`, root `main.*`, `src/app.ts` / `.js`, or the module script in `index.html`. If none match, add manually:

```ts
import 'morya-ui/styles.css'
import './styles/morya-app-shell.css'
```

The CLI does **not** call `app.use(MoryaUI)` or edit `App.vue`.

## Local development (this monorepo)

```bash
pnpm setup:sync-template   # refresh packages/setup/template from design-kit
pnpm setup:build
node packages/setup/bin/morya-ui-setup.js --cwd /path/to/app --dry-run
```

## License

MIT
