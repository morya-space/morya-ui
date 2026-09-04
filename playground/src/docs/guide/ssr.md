---
title: SSR 与服务端框架
order: 7
description: 在 Nuxt、Astro、Vite SSR 等环境中使用 Well Insight UI。
---

# SSR 与服务端框架

Well Insight UI 面向 **Vue 3.3+** 的 SSR 场景做了兼容：服务端不会访问 `document` / `window`，组件实例 id 在服务端与客户端保持一致，命令式 API（`toast` / `message` / `confirm`）在服务端自动跳过。

以下框架均可接入；按场景选择 **全量 SSR** 或 **客户端 Islands**。

## 通用约定

| 项 | 建议 |
| --- | --- |
| 样式 | 在应用入口或框架配置中引入 `@well-insight/ui/styles.css` |
| 主题 | 优先用根级 **`WiConfigProvider`** 设置 `theme` / `density`，避免在 SSR 阶段单独调用 `useTheme()` 写 `document` |
| 命令式反馈 | `toast()`、`message()`、`confirm()` 仅在浏览器执行；SSR 期间调用不会报错，但不会渲染 |
| 按需导入 | 配合 `@well-insight/ui/resolver` 与 `unplugin-vue-components` 减小体积 |
| 浮层 | Dialog / Select / Tooltip 等使用 Vue `Teleport`；SSR 可输出占位，交互在客户端水合后生效 |

## Nuxt 3

推荐使用官方模块 **`@well-insight/nuxt`**（同仓库 `packages/nuxt`）。

### 安装

```bash
pnpm add @well-insight/ui @well-insight/nuxt
pnpm add -D unplugin-vue-components
```

### 配置

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WellInsightResolver } from '@well-insight/ui/resolver'

export default defineNuxtConfig({
  modules: ['@well-insight/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [WellInsightResolver()],
      }),
    ],
  },
})
```

模块默认会：

- 引入 `@well-insight/ui/styles.css`
- 将 `@well-insight/ui` 加入 `build.transpile`
- 在客户端注册 overlay 上下文（供 `toast` / `message` 使用）

### 根布局

```vue
<!-- app.vue -->
<template>
  <WiConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </WiConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

按需导入时无需 `app.use(WellInsight)`；若需全量注册，可在 `plugins/well-insight.client.ts` 中 `nuxtApp.vueApp.use(WellInsight)`。

### 仅客户端组件

极少数依赖浏览器专有 API 的场景（如自定义 `appendTo` 到尚未存在的节点），可用 Nuxt 的 `<ClientOnly>` 包裹。

## Astro + Vue

适合 **静态页 + Vue 岛**（管理后台、控制台嵌入营销站）。

### 安装

```bash
pnpm add @well-insight/ui
npx astro add vue
```

### 在 Vue 岛中使用

```astro
---
// src/pages/admin.astro
import AdminShell from '../components/AdminShell.vue'
---
<AdminShell client:load />
```

```vue
<!-- src/components/AdminShell.vue -->
<script setup lang="ts">
import { WiButton, WiConfigProvider } from '@well-insight/ui'
import '@well-insight/ui/styles.css'
</script>

<template>
  <WiConfigProvider theme="light">
    <WiButton label="Hello" />
  </WiConfigProvider>
</template>
```

- 交互型后台推荐 `client:load` 或 `client:only`
- 纯展示块可用 `client:visible` 延迟水合
- Astro 本身不做 Vue SSR 时，无需处理 hydration id 问题

## Vite SSR（含自定义服务端）

```ts
// main.server.ts / entry-server.ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import { WiConfigProvider } from '@well-insight/ui/config-provider'
import '@well-insight/ui/styles.css'

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
```

客户端入口可注册 overlay 插件：

```ts
// entry-client.ts
import { createWellInsight } from '@well-insight/ui'

createApp(/* ... */)
  .use(createWellInsight({ components: false }))
  .mount('#app')
```

构建时确保 `@well-insight/ui` 进入 `ssr.noExternal`（或 `ssr: { noExternal: ['@well-insight/ui'] }`），以便正确处理 `.vue` 与 CSS 副作用。

## 其他 Vue SSR 方案

| 方案 | 说明 |
| --- | --- |
| **Quasar (SSR mode)** | 在 `quasar.config` 的 `build.transpileDependencies` 中加入 `@well-insight/ui`，入口引入样式 |
| **vite-plugin-ssr / vike** | 与 Vite SSR 相同：服务端渲染 + 客户端 `createWellInsight({ components: false })` |
| **Inertia + Vue SSR** | 根组件包 `WiConfigProvider`；命令式 API 仅在 `onMounted` 后调用 |

## 已知限制

- **不支持 Vue 2**；SSR 仅适用于 Vue 3。
- **IE** 不在支持范围内（与 Vue 3 一致）。
- 主题 `localStorage` 持久化仅在浏览器生效；SSR 首屏使用 `WiConfigProvider` 或 cookie 同步主题可避免闪动。
- 全量 E2E SSR 回归仍在完善；若遇到 hydration 警告，请提供最小复现并 [提 Issue](https://github.com/well-insight/well-insight-ui/issues)。

## 下一步

- [快速上手](/docs/quick-start)：安装与导入方式
- [全局配置](/docs/config)：`WiConfigProvider`
- [主题](/docs/theme)：亮暗色与 token
