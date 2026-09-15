# @morya-ui/setup

One-shot setup for consumer Vue projects using [`morya-ui`](https://www.npmjs.com/package/morya-ui).

Docs (zh/en):

- [AI setup](https://morya-space.github.io/morya-ui/docs/ai-setup) — one-shot CLI
- [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill) — `morya-ui-pages` behavior

Installs the UI library, copies Agent skill / Cursor rules / design docs from `ai-design-config`, merges Cursor MCP for [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp), and tries to inject `import 'morya-ui/styles.css'` into the app entry.

## Usage

In your app project root:

```bash
npx @morya-ui/setup
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
| `--skip-styles` | Do not inject `styles.css` import |
| `--skip-scripts` | Do not add `check:colors` to `package.json` |
| `-h`, `--help` | Show help |

### Conflict policy

- Template files and `.cursor/rules/*`: **skip** if the destination exists (unless `--force`).
- `.cursor/mcp.json`: merge other servers; skip existing `morya-ui` entry unless `--force`.
- `package.json` `check:colors`: add only if missing (unless `--force`).
- Styles: inject only when an entry file is found and the import is not already present.

### What gets copied

From the package `template/` (synced from repo `ai-design-config/`):

- `DESIGN.md`
- `.agents/skills/morya-ui-pages/`
- `.cursor/rules/`
- `docs/` (component index, golden pages, feedback guide)
- `design-tokens/`
- `scripts/check-raw-colors.mjs`
- `src/examples/`

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
```

The CLI does **not** call `app.use(MoryaUI)` or edit `App.vue`.

## Local development (this monorepo)

```bash
pnpm setup:sync-template   # refresh packages/setup/template from ai-design-config
pnpm setup:build
node packages/setup/bin/morya-ui-setup.js --cwd /path/to/app --dry-run
```

## License

MIT
