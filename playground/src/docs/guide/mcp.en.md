---
title: Agent MCP
order: 13
description: Optional MCP server for AI clients that support the Model Context Protocol.
---

# Agent MCP

[`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp) is an optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server. It indexes this site’s component docs, examples, and guides so **any MCP-capable AI client** can look up the real API.

You do **not** need MCP to use the component library. Apps still only depend on:

```bash
pnpm add morya-ui
```

```ts
import 'morya-ui/styles.css'
```

For Agent skill, Cursor rules, and writing MCP in one step, see [One-shot setup](/docs/setup). AI workflow: [AI setup](/docs/ai-setup). Skill behavior: [Agent Skill](/docs/agent-skill).

## How to connect

MCP clients start the package over stdio:

```bash
npx -y @morya-ui/mcp
```

Generic shape:

```json
{
  "command": "npx",
  "args": ["-y", "@morya-ui/mcp"]
}
```

Field names differ by client. Any client that supports MCP stdio can connect.

### Common client config examples

Snippets for popular products. Key names may change across versions — check each product’s docs.

**Cursor** (`.cursor/mcp.json` or user-level MCP settings):

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

**Claude Desktop / Claude Code** (`claude_desktop_config.json`, etc.):

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

**Windsurf** (MCP servers in settings):

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

**Cline** (MCP servers in the VS Code extension settings):

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

**Zed** (`settings.json` → `context_servers`):

```json
{
  "context_servers": {
    "morya-ui": {
      "command": "npx",
      "args": ["-y", "@morya-ui/mcp"]
    }
  }
}
```

**Continue** (`config.json` / YAML MCP servers — follow the current schema):

```json
{
  "mcpServers": [
    {
      "name": "morya-ui",
      "command": "npx",
      "args": ["-y", "@morya-ui/mcp"]
    }
  ]
}
```

## Tools

### Core — component docs

| Tool | Purpose |
| --- | --- |
| `list` | List components / guides / examples / categories / patterns |
| `search` | Search docs, examples, patterns, and decision guides |
| `get_component` | Read component docs and API |
| `get_example` | Return a source example |
| `get_guide` | Read a guide |
| `get_setup` | Install and setup guidance |
| `validate_usage` | Soft-check usage against documented props/events |
| `version` | Version and catalog status |

### Advanced — page composition (optional)

| Tool | Purpose |
| --- | --- |
| `list_patterns` | List reusable page composition patterns |
| `get_pattern` | Read a pattern's structure, layout, and rules |
| `recommend_page` | Recommend a pattern from page intent; optional starter scaffold |
| `get_design_rules` | Design-token and MPage* composition rules |
| `recommend_component` | List, read, or recommend component selection guides |
| `list_golden_pages` | List golden page samples |
| `get_golden_page` | Read a golden page Vue source (`list-page` … `settings-page`, `wizard-form`, …) |
| `list_page_snippets` | List reusable page section snippets |
| `get_page_snippet` | Read a local section snippet (filters, toolbar, …) |
| `validate_page` | Check page composition, spacing, double-border, and contract hints (`rows`, message, MStatus) |

Most tools accept `mode`: `zh` (default) or `en`.

Component lookup accepts common aliases such as `DataTable`, `数据表格`, `Pager`, and `确认弹窗`.

### Recommended workflow

**Look up a component:** `search` / `get_component` → `get_example` → `validate_usage`

**Plan a page:** `recommend_page` → `get_golden_page` → `get_pattern` → `get_design_rules` → `get_component` / `get_example` → **`validate_usage`** → `validate_page`. Use `recommend_component` when choosing between similar components.

**Edit one section:** `list_page_snippets` → `get_page_snippet` → `get_component` / `get_example` → `validate_usage` → `validate_page`

Pass `includeScaffold: true` to `recommend_page` for starter Vue code (returns the golden page source when one exists):

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
- `decision` only → read one guide
- `query` → recommend a component for a UI question

Current guides include `form-surface-choice`, `overlay-choice`, `data-display-choice`, `selection-choice` (Select / TreeSelect / CascadeSelect / Listbox / SelectButton / Radio / AutoComplete), `status-label-choice`, `empty-result-choice`, `action-menu-choice`, `loading-choice`, `page-scroll-choice`, `surface-choice`, `page-section-choice`, `layout-spacing-choice`, and `surface-nesting-choice`.

## Prompt examples

After connecting, you can ask the assistant to use this server, for example:

> Use the morya-ui MCP to look up Dialog props and give an example with confirm / cancel actions.

> Search for date-related components, pick one suitable for forms, and write a minimal usage from the docs.

> Following the Button docs from MCP, write a delete button with `severity="danger"` and validate the props.

The assistant should call tools first, then produce something like:

```vue
<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <MButton label="Delete" severity="danger" />
</template>
```

## Relation to this site

The catalog is generated from the same sources as this site (component `docs/` + guide Markdown). After docs change, maintainers republish `@morya-ui/mcp`; clients using `npx -y` pick up the new release.

Implementation notes live in [packages/ui-mcp/README.md](https://github.com/morya-space/morya-ui/tree/main/packages/ui-mcp).

## Next steps

- [One-shot setup](/docs/setup): `npx @morya-ui/setup`
- [AI setup](/docs/ai-setup): Agent skill and MCP workflow
- [Agent Skill](/docs/agent-skill): when to use `morya-ui-pages`
- [Quick start](/docs/quick-start): install and use components in an app
- [Components](/components): browse live examples and APIs
