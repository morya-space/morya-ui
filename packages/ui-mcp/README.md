# @wex-design/ui-mcp

Optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server for [`@wex-design/ui`](https://www.npmjs.com/package/@wex-design/ui).

It indexes component docs, guides, examples, and reusable page patterns so **any MCP-capable AI client** can look up the real API before writing code. It does **not** replace installing the UI library:

```bash
pnpm add @wex-design/ui
```

Public docs: run the docs site (`pnpm dev`) and open **Docs → MCP**.

## Run

```bash
npx -y @wex-design/ui-mcp
```

Typical client config (field names vary by client):

```json
{
  "command": "npx",
  "args": ["-y", "@wex-design/ui-mcp"]
}
```

Local checkout:

```bash
pnpm --filter @wex-design/ui-mcp build
node packages/ui-mcp/bin/wex-design-ui-mcp.js
```

## Tools

MCP also exposes **resources** and **resource templates** for clients that support `resources/list`, `resources/templates/list`, and `resources/read`. Call `version` to see the current resource and template counts.

Static resources:

- `wi://catalog/index.json`
- `wi://design-rules.json`

Resource templates:

- `component-docs` → `wi://components/{component}/docs/{locale}`
- `component-api` → `wi://components/{component}/api.json`
- `guide-docs` → `wi://guides/{guide}/docs/{locale}`

### Core — component docs

| Tool             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `list`           | List components / guides / examples / categories / patterns |
| `search`         | Search docs, examples, patterns, and decisions |
| `get_component`  | Component metadata and API                   |
| `get_example`    | One source-backed example                    |
| `get_guide`      | Guide docs                                   |
| `get_setup`      | Install / setup bundle                       |
| `validate_usage` | Soft-check props / events                    |
| `version`        | Package + catalog status                     |

### Advanced — page composition (optional)

| Tool                  | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `list_patterns`       | List reusable page composition patterns                       |
| `get_pattern`         | Read a pattern's structure, layout, and rules                 |
| `recommend_page`      | Recommend a pattern from page intent; optional starter scaffold |
| `get_design_rules`    | Design-token and composition rules                            |
| `recommend_component` | List, read, or recommend component selection guides           |

`mode`: `zh` (default) or `en`.

Component lookup accepts common aliases such as `DataTable`, `数据表格`, `Pager`, and `确认弹窗`.

### Recommended workflow

**Look up a component:**

1. `search` or `get_component`
2. `get_example` for unfamiliar APIs
3. `validate_usage` on generated snippets

**Plan a page:**

1. `recommend_page` with business intent, page type, and features
2. `get_pattern` for the returned `matchedPattern`
3. `get_component` / `get_example` for core components
4. `get_design_rules` before custom layout or CSS
5. `recommend_component` when choosing between similar components

For a starter Vue file, pass `includeScaffold: true` to `recommend_page`:

```json
{
  "intent": "Oil well management list",
  "pageType": "list",
  "features": ["filters", "create", "pagination"],
  "mode": "en",
  "includeScaffold": true
}
```

`recommend_component` modes:

- omit `query` and `decision` → list decision guides
- `decision` only → read one guide (e.g. `overlay-choice`)
- `query` → recommend a component for a UI question

## Develop

```bash
pnpm install
pnpm mcp:generate
pnpm mcp:build
```

Catalog sources: `src/components/*/docs` and `playground/src/docs/guide/*.md`.

```bash
pnpm mcp:generate
pnpm mcp:check-catalog
pnpm mcp:validate-catalog
pnpm mcp:audit-examples
```

## Release

From the repo root (version syncs from `@wex-design/ui`):

```bash
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
