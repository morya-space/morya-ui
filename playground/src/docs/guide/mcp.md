---
title: MCP
order: 6
description: 可选的 MCP 服务，供支持 Model Context Protocol 的 AI 客户端检索本库文档。
---

# MCP

[`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp) 是可选的 [Model Context Protocol](https://modelcontextprotocol.io/)（stdio）服务。它把本站组件文档、示例与指南做成可检索工具，方便 **支持 MCP 的 AI 客户端** 按真实 API 生成代码。

日常使用组件库 **不需要** 安装或配置 MCP。应用里仍然只依赖：

```bash
pnpm add @well-insight/ui
```

```ts
import '@well-insight/ui/styles.css'
```

## 接入方式

MCP 客户端通过 stdio 启动本包即可：

```bash
npx -y @well-insight/ui-mcp
```

通用写法：

```json
{
  "command": "npx",
  "args": ["-y", "@well-insight/ui-mcp"]
}
```

字段名因客户端而异，只要支持 MCP stdio 即可接入。

### 常见客户端配置示例

以下为常见产品的配置片段，键名可能随版本变化，以各产品官方文档为准。

**Cursor**（`.cursor/mcp.json` 或用户级 MCP 配置）：

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

**Claude Desktop / Claude Code**（`claude_desktop_config.json` 等）：

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

**Windsurf**（MCP 设置中的 servers 配置）：

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

**Cline**（VS Code 扩展设置中的 MCP servers）：

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

**Zed**（`settings.json` → `context_servers`）：

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

**Continue**（`config.json` / YAML 中的 MCP servers，字段名以当前版本为准）：

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

## 可用工具

| 工具 | 作用 |
| --- | --- |
| `list` | 列出组件 / 指南 / 示例 / 分类 |
| `search` | 搜索文档与示例 |
| `get_component` | 读取组件说明与 API |
| `get_example` | 获取源码示例 |
| `get_guide` | 读取指南 |
| `get_setup` | 安装与初始化说明 |
| `validate_usage` | 对照文档粗检用法 |
| `version` | 版本与目录状态 |

多数工具支持 `mode`：`zh`（默认）或 `en`。

## 对话示例

接入后，可直接让助手调用本服务，例如：

> 用 well-insight-ui 的 MCP 查一下 Dialog 的 props，并给一个带确认 / 取消按钮的示例。

> 搜索和「日期」相关的组件，选一个适合表单的，按文档写出最小用法。

> 根据 MCP 里 Button 的文档，写一个 `severity="danger"` 的删除按钮，并校验 props 是否合法。

助手应先调用工具，再基于返回内容生成类似：

```vue
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <WiButton label="删除" severity="danger" />
</template>
```

## 与文档站的关系

目录与本站同源（组件 `docs/` + 指南 Markdown）。官网文档更新后，维护者重新发布 `@well-insight/ui-mcp`，客户端通过 `npx -y` 即可拿到新版本。

更多实现细节见仓库内 [packages/ui-mcp/README.md](https://github.com/well-insight/well-insight-ui/tree/main/packages/ui-mcp)。

## 下一步

- [快速上手](/docs/quick-start)：在应用中安装并使用组件
- [组件](/components)：浏览全部组件与交互示例
