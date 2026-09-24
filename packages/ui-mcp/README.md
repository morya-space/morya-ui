# @morya-ui/mcp

Optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server for [`morya-ui`](https://www.npmjs.com/package/morya-ui).

It indexes component docs, guides, examples, and reusable page patterns so **any MCP-capable AI client** can look up the real API before writing code. It does **not** replace installing the UI library:

```bash
pnpm add morya-ui
```

Public docs: run the docs site (`pnpm dev`) and open **Docs → MCP**.

## Run

```bash
npx -y @morya-ui/mcp
```

Typical client config (field names vary by client):

```json
{
  "command": "npx",
  "args": ["-y", "@morya-ui/mcp"]
}
```

Local checkout:

```bash
pnpm --filter @morya-ui/mcp build
node packages/ui-mcp/bin/morya-ui-mcp.js
```

## Tools

MCP also exposes **resources** and **resource templates** for clients that support `resources/list`, `resources/templates/list`, and `resources/read`. Call `version` to see the current resource and template counts.

Static resources:

- `m://catalog/index.json`
- `m://design-rules.json`

Resource templates:

- `component-docs` → `m://components/{component}/docs/{locale}`
- `component-api` → `m://components/{component}/api.json`
- `guide-docs` → `m://guides/{guide}/docs/{locale}`

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
| `list_golden_pages`   | List golden page samples (list / form / dashboard)            |
| `get_golden_page`     | Read golden page Vue source                                   |
| `list_page_snippets`  | List section snippets for local page edits                      |
| `get_page_snippet`    | Read a section snippet (`filters`, `toolbar`, `form-actions`…)  |
| `validate_page`       | Check page composition, spacing, and border anti-patterns     |

`mode`: `zh` (default) or `en`.

Component lookup accepts common aliases such as `DataTable`, `数据表格`, `Pager`, and `确认弹窗`.

### Recommended workflow

**Look up a component:**

1. `search` or `get_component`
2. `get_example` for unfamiliar APIs
3. `validate_usage` on generated snippets

**Plan a page:**

1. `recommend_page` with business intent, page type, and features
2. `get_golden_page` for the matched golden sample (`list-page`, `form-page`, `form-in-dialog`, `detail-page`, `dashboard-page`, `login-page`, `landing-page`, `empty-state`, `result-page`, `settings-page`, `wizard-form`). `includeScaffold` returns that golden source when available.
3. `get_pattern` for the returned `matchedPattern`
4. `get_design_rules` for MPage* composition recipes
5. `get_component` / `get_example` for core components (including `Page`)
6. `recommend_component` when choosing between similar components
7. `validate_page` on generated Vue code before finishing

**Edit one section of an existing page:**

1. `list_page_snippets` with `query` or `pageType`
2. `get_page_snippet` for the matched section (`list-filters`, `form-actions`, …)
3. `get_component` / `get_example` for unfamiliar imports
4. `validate_usage` + `validate_page` on the merged result

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
- `decision` only → read one guide with **when / avoidWhen / recipe (props, slots, events) / antiPatterns** (e.g. `overlay-choice`, `selection-choice`, `feedback-choice`, `confirm-choice`)
- `query` → recommend a guide for a UI question (same recipe payload)

Offline mirror for the page skill: `design-kit/.../references/decision-recipes.md` (regenerate with `pnpm --filter @morya-ui/mcp generate:recipes`).

## Develop

```bash
pnpm install
pnpm mcp:generate
pnpm mcp:build
```

After editing `src/decisions.ts`, run `pnpm --filter @morya-ui/mcp generate:recipes` (also runs as part of `build`) so the skill offline recipes stay in sync.

```bash
pnpm mcp:generate
pnpm mcp:check-catalog
pnpm mcp:validate-catalog
pnpm mcp:audit-examples
```

## Release

From the repo root (version syncs from `morya-ui`):

```bash
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
