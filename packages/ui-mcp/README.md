# @well-insight/ui-mcp

Optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server for [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui).

It indexes component docs, guides, and examples so **any MCP-capable AI client** can look up the real API. It does **not** replace installing the UI library:

```bash
pnpm add @well-insight/ui
```

Public docs: run the docs site (`pnpm dev`) and open **Docs → MCP**.

## Run

```bash
npx -y @well-insight/ui-mcp
```

Typical client config (field names vary by client):

```json
{
  "command": "npx",
  "args": ["-y", "@well-insight/ui-mcp"]
}
```

Local checkout:

```bash
pnpm --filter @well-insight/ui-mcp build
node packages/ui-mcp/bin/well-insight-ui-mcp.js
```

## Tools

| Tool | Purpose |
| --- | --- |
| `list` | List components / guides / examples / categories |
| `search` | Search docs and examples |
| `get_component` | Component metadata and API |
| `get_example` | One source-backed example |
| `get_guide` | Guide docs |
| `get_setup` | Install / setup bundle |
| `validate_usage` | Soft-check props / events |
| `version` | Package + catalog status |

`mode`: `zh` (default) or `en`.

## Develop

```bash
pnpm install
pnpm mcp:generate
pnpm mcp:build
```

Catalog sources: `src/components/*/docs` and `playground/src/docs/guide/*.md`.

## Release

From the repo root (version syncs from `@well-insight/ui`):

```bash
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
