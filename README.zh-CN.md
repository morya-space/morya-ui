# @well-insight/ui

[English](./README.md) · [中文](./README.zh-CN.md)

面向 Well Insight 的开源 Vue 3 组件库：带主题的表单、浮层、数据展示与反馈等基础控件。

| | |
| --- | --- |
| **npm** | [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui) |
| **文档** | 本地 `pnpm dev` → http://localhost:5182 |
| **源码** | [GitHub](https://github.com/well-insight/well-insight-ui) |
| **更新日志** | [CHANGELOG.md](./CHANGELOG.md) · [English](./CHANGELOG.en.md) |

## 要求

- Vue `^3.5`
- 能解析包 `exports` 的构建工具（Vite、webpack 5+ 等）

## 安装

```bash
pnpm add @well-insight/ui
# npm i @well-insight/ui
# yarn add @well-insight/ui
```

## 快速开始

在应用入口引入样式，再按需引入组件：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdInput } from '@well-insight/ui'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WdInput v-model="name" label="姓名" placeholder="请输入姓名" />
    <WdButton label="提交" />
  </div>
</template>
```

支持按需导入（Tree-shaking）。样式需单独引入 `@well-insight/ui/styles.css`。

更完整的上手说明见文档站 [快速上手](./playground/src/docs/guide/quick-start.md)。

## 应用级默认配置

可选插件 `createWellInsight`，用于设置全局默认值（浮层挂载、尺寸、密度、语言、z-index）：

```ts
import { createApp } from 'vue'
import { createWellInsight, enUS } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App)
  .use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      density: 'comfortable',
      zIndex: 1100,
      locale: enUS,
    }),
  )
  .mount('#app')
```

| 选项 | 作用 |
| --- | --- |
| `appendTo` | 浮层默认 Teleport 目标（默认 `'body'`） |
| `size` | 控件默认尺寸 |
| `density` | `compact` / `comfortable` / `spacious` |
| `inputVariant` | `outlined` / `filled` |
| `zIndex` | 浮层 z-index 基准 |
| `locale` | 内置文案（默认 `zhCN`，或 `enUS` / 局部覆盖） |

子树覆盖使用 `<WdConfigProvider>`。解析顺序：

**组件 Props → `WdConfigProvider` → `createWellInsight` → 内置默认**

详见文档站 [全局配置](./playground/src/docs/guide/config.md)。

## 语言

内置文案默认为**中文**。可切换英文或覆盖部分 key：

```ts
import { createWellInsight, enUS, zhCN } from '@well-insight/ui'

createWellInsight({ locale: enUS })

createWellInsight({
  locale: {
    ...zhCN,
    accept: '确定',
  },
})
```

## 主题

亮色 / 暗色 token 与辅助 API 同包导出：

```ts
import { useTheme } from '@well-insight/ui'

const { theme, isDark, setTheme, toggleTheme } = useTheme()
```

`useTheme` 会把选择写入 `localStorage`；未设置时尊重 `prefers-color-scheme`。相关 API：`useDensity`、`useMotion`、`applyTheme`、`lightTokens`、`darkTokens`。

详见文档站 [主题](./playground/src/docs/guide/theme.md)。

## 反馈 API

命令式反馈，无需自行挂载宿主（需要时会自动挂载）：

```ts
import { message, toast } from '@well-insight/ui'

message.success('已保存')
message.error('出错了')

toast.add({ severity: 'info', summary: '提示', detail: '详情在此' })
```

需要受控宿主时仍可渲染 `<WdMessage />` / `<WdToast />`。

## 导出

| 导入 | 用途 |
| --- | --- |
| `@well-insight/ui` | 组件、`createWellInsight`、`WdConfigProvider`、主题与语言、`message` / `toast` |
| `@well-insight/ui/styles.css` | 必需样式（token + 组件样式） |

TypeScript 类型已通过包 `exports` 提供。

## 本地开发

```bash
pnpm install
pnpm dev          # 文档站 → http://localhost:5182
pnpm build        # 组件库 → dist/
pnpm build:docs   # 静态文档站
pnpm test
pnpm typecheck
```

维护者文档：[开发指南](./docs/DEVELOPMENT.zh-CN.md) · [UI 开发](./docs/ui-development.zh-CN.md) · [发版脚本](./scripts/README.md)

## 可选：MCP

若使用支持 [Model Context Protocol](https://modelcontextprotocol.io/) 的 AI 客户端，可额外接入 [`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp)，让助手按本库文档检索组件 API。**这不替代** `pnpm add @well-insight/ui`。

说明见文档站 [MCP](./playground/src/docs/guide/mcp.md)。

## 许可证

MIT
