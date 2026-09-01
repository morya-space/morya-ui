---
title: MCP
order: 6
description: Optional MCP server for AI clients that support the Model Context Protocol.
---

# MCP

[`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp) is an optional [Model Context Protocol](https://modelcontextprotocol.io/) (stdio) server. It indexes this site’s component docs, examples, and guides so **any MCP-capable AI client** can look up the real API.

You do **not** need MCP to use the component library. Apps still only depend on:

```bash
pnpm add @well-insight/ui
```

```ts
import '@well-insight/ui/styles.css'
```

## How to connect

MCP clients start the package over stdio:

```bash
npx -y @well-insight/ui-mcp
```

Generic shape:

```json
{
  "command": "npx",
  "args": ["-y", "@well-insight/ui-mcp"]
}
```

Field names differ by client. Any client that supports MCP stdio can connect.

### Common client config examples

Snippets for popular products. Key names may change across versions — check each product’s docs.

**Cursor** (`.cursor/mcp.json` or user-level MCP settings):

```json
{
  "mcpServers": {
    "well-insight-ui": {
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
    }
  }
}
```

**Claude Desktop / Claude Code** (`claude_desktop_config.json`, etc.):

```json
{
  "mcpServers": {
    "well-insight-ui": {
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
    }
  }
}
```

**Windsurf** (MCP servers in settings):

```json
{
  "mcpServers": {
    "well-insight-ui": {
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
    }
  }
}
```

**Cline** (MCP servers in the VS Code extension settings):

```json
{
  "mcpServers": {
    "well-insight-ui": {
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
    }
  }
}
```

**Zed** (`settings.json` → `context_servers`):

```json
{
  "context_servers": {
    "well-insight-ui": {
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
    }
  }
}
```

**Continue** (`config.json` / YAML MCP servers — follow the current schema):

```json
{
  "mcpServers": [
    {
      "name": "well-insight-ui",
      "command": "npx",
      "args": ["-y", "@well-insight/ui-mcp"]
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
| `get_design_rules` | Design-token and composition rules |
| `recommend_component` | List, read, or recommend component selection guides |

Most tools accept `mode`: `zh` (default) or `en`.

### Recommended workflow

**Look up a component:** `search` / `get_component` → `get_example` → `validate_usage`

**Plan a page:** `recommend_page` → `get_pattern` → `get_component` / `get_example` → `get_design_rules`; use `recommend_component` when choosing between similar components

Pass `includeScaffold: true` to `recommend_page` for starter Vue code:

```json
{
  "intent": "Oil well management list",
  "pageType": "list",
  "features": ["filters", "create", "pagination"],
  "includeScaffold": true
}
```

`recommend_component` modes:

- omit `query` and `decision` → list decision guides
- `decision` only (e.g. `overlay-choice`) → read one guide
- `query` → recommend a component for a UI question

## Prompt examples

After connecting, you can ask the assistant to use this server, for example:

> Use the well-insight-ui MCP to look up Dialog props and give an example with confirm / cancel actions.

> Search for date-related components, pick one suitable for forms, and write a minimal usage from the docs.

> Following the Button docs from MCP, write a delete button with `severity="danger"` and validate the props.

The assistant should call tools first, then produce something like:

```vue
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <WiButton label="Delete" severity="danger" />
</template>
```

## Relation to this site

The catalog is generated from the same sources as this site (component `docs/` + guide Markdown). After docs change, maintainers republish `@well-insight/ui-mcp`; clients using `npx -y` pick up the new release.

Implementation notes live in [packages/ui-mcp/README.md](https://github.com/well-insight/well-insight-ui/tree/main/packages/ui-mcp).

## Next steps

- [Quick start](/docs/quick-start): install and use components in an app
- [Components](/components): browse live examples and APIs
