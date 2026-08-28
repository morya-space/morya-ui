# @well-insight/ui-mcp

Optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server for [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui).

It indexes component docs, guides, examples, and reusable page patterns so **any MCP-capable AI client** can plan a page before looking up the real API. It does **not** replace installing the UI library:

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

| Tool                  | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `list`                | List components / guides / examples / categories / patterns / decisions |
| `search`              | Search docs, examples, page patterns, and decisions                     |
| `get_component`       | Component metadata and API                                              |
| `get_example`         | One source-backed example                                               |
| `get_guide`           | Guide docs                                                              |
| `get_setup`           | Install / setup bundle                                                  |
| `validate_usage`      | Soft-check props / events                                               |
| `list_patterns`       | List reusable page composition patterns                                 |
| `get_pattern`         | Read a pattern's structure, layout, and rules                           |
| `recommend_page`      | Recommend a pattern from page intent and features                       |
| `generate_page`       | Generate a Vue 3 + TypeScript page scaffold (no file write)             |
| `create_page`         | Preview or safely write a generated page inside the current project     |
| `get_design_rules`    | Return design-token and composition rules                               |
| `validate_page`       | Validate page-level component composition and UX rules                  |
| `list_decisions`      | List component selection decision guides                                |
| `get_decision`        | Read bilingual guidance for a component choice                          |
| `recommend_component` | Recommend a component for a UI question                                 |
| `version`             | Package + catalog status                                                |

`mode`: `zh` (default) or `en`.

Component lookup accepts common aliases such as `DataTable`, `数据表格`, `Pager`, and `确认弹窗`, and resolves them to the library's canonical component names.

All page patterns and component decision guides contain Chinese and English guidance. Pass `mode: "en"` for English output, or omit it for Chinese output.

### Recommended page workflow

The current pattern library covers list, form, detail, dashboard, settings, empty state, authentication, and multi-step wizard pages.

For page generation, call the tools in this order:

1. `recommend_page` with the business intent, page type, and features.
2. `get_pattern` with the returned `matchedPattern`.
3. `get_component` for the selected components and `get_example` for unfamiliar APIs.
4. `get_design_rules` before writing layout and custom CSS.
5. `validate_usage` after generating the Vue code.
6. `validate_page` with the pattern and complete page code.
7. `recommend_component` when two or more components could solve the same problem.

For a direct scaffold, use `generate_page`. It chooses the requested pattern (or recommends one), returns `vue.script`, `vue.template`, `vue.style`, a combined `files.component`, and an automatic `validation.page` report. It supports `mode: "zh"` and `mode: "en"`; generated code is intentionally a scaffold and requires real API state, data, events, and business validation.

```json
{
  "intent": "Oil well management list",
  "pageType": "list",
  "features": ["filters", "create", "pagination"],
  "mode": "en",
  "responsive": true
}
```

Use `create_page` only when you want the MCP to write the scaffold. It always previews by default and returns the generated content without modifying files. Pass `confirm: true` to write; the path must be relative to the current project and remain inside it. Existing files are overwritten only when `confirm: true`, and the response reports `overwritten` accurately.

```json
{
  "path": "src/views/WellList.vue",
  "intent": "油井管理列表",
  "pageType": "list",
  "features": ["筛选", "新增", "分页"],
  "mode": "zh",
  "confirm": false
}
```

Example request:

```json
{
  "intent": "油井列表管理",
  "pageType": "list",
  "features": ["筛选", "新增", "编辑", "删除", "状态", "分页"]
}
```

## Develop

```bash
pnpm install
pnpm mcp:generate
pnpm mcp:build
```

Catalog sources: `src/components/*/docs` and `playground/src/docs/guide/*.md`.

The catalog is generated at build time; the server does not watch source files while running. For a local checkout, regenerate after changing components or docs:

```bash
pnpm mcp:generate
pnpm mcp:check-catalog
pnpm mcp:validate-catalog
pnpm mcp:audit-examples
```

`pnpm mcp:audit-examples` reports which documented Props, Events, Slots, and exposed instance methods are not demonstrated by source-backed examples. It is an audit report rather than a requirement that every boolean alias appear in one snippet; use it to plan focused examples by capability group.

A published `@well-insight/ui-mcp` package serves the catalog bundled in that package. Its component API and examples are current as of the package release, not automatically the latest files in another local checkout. Keep `@well-insight/ui` and `@well-insight/ui-mcp` on compatible versions, and rebuild/release the MCP package whenever component props, events, slots, or examples change.

## Release

From the repo root (version syncs from `@well-insight/ui`):

```bash
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
