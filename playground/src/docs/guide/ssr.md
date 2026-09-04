---
title: SSR 与服务端框架
order: 7
description: 在 Nuxt、Astro、Vite SSR 等环境中使用 Wex Design UI。
---

# SSR 与服务端框架

Wex Design UI 面向 **Vue 3** 的 SSR 场景做了兼容（推荐 3.5 及以上）：服务端不会访问 `document` / `window`，组件实例 id 在服务端与客户端保持一致，命令式 API（`toast` / `message` / `confirm`）在服务端自动跳过。

以下框架均可接入；按场景选择 **全量 SSR** 或 **客户端 Islands**。

## 通用约定

| 项 | 建议 |
| --- | --- |
| 样式 | 在应用入口或框架配置中引入 `@wex-design/ui/styles.css` |
| 主题 | 优先用根级 **`WdConfigProvider`** 设置 `theme` / `density`，避免在 SSR 阶段单独调用 `useTheme()` 写 `document` |
| 命令式反馈 | `toast()`、`message()`、`confirm()` 仅在浏览器执行；SSR 期间调用不会报错，但不会渲染 |
| 按需导入 | 配合 `@wex-design/ui/resolver` 与 `unplugin-vue-components` 减小体积 |
| 浮层 | Dialog / Select / Tooltip 等使用 Vue `Teleport`；SSR 可输出占位，交互在客户端水合后生效 |

## Nuxt 3

推荐使用官方模块 **`@wex-design/nuxt`**（同仓库 `packages/nuxt`）。

### 安装

```bash
pnpm add @wex-design/ui @wex-design/nuxt
pnpm add -D unplugin-vue-components
```

### 配置

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WexDesignResolver } from '@wex-design/ui/resolver'

export default defineNuxtConfig({
  modules: ['@wex-design/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [WexDesignResolver()],
      }),
    ],
  },
})
```

模块默认会：

- 引入 `@wex-design/ui/styles.css`
- 将 `@wex-design/ui` 加入 `build.transpile`
- 在客户端注册 overlay 上下文（供 `toast` / `message` 使用）

### 根布局

```vue
<!-- app.vue -->
<template>
  <WdConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </WdConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

按需导入时无需 `app.use(WexDesign)`；若需全量注册，可在 `plugins/wex-design.client.ts` 中 `nuxtApp.vueApp.use(WexDesign)`。

### 仅客户端组件

极少数依赖浏览器专有 API 的场景（如自定义 `appendTo` 到尚未存在的节点），可用 Nuxt 的 `<ClientOnly>` 包裹。

## Astro + Vue

适合 **静态页 + Vue 岛**（管理后台、控制台嵌入营销站）。

### 安装

```bash
pnpm add @wex-design/ui
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
import { WdButton, WdConfigProvider } from '@wex-design/ui'
import '@wex-design/ui/styles.css'
</script>

<template>
  <WdConfigProvider theme="light">
    <WdButton label="Hello" />
  </WdConfigProvider>
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
import { WdConfigProvider } from '@wex-design/ui/config-provider'
import '@wex-design/ui/styles.css'

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
```

客户端入口可注册 overlay 插件：

```ts
// entry-client.ts
import { createWexDesign } from '@wex-design/ui'

createApp(/* ... */)
  .use(createWexDesign({ components: false }))
  .mount('#app')
```

构建时确保 `@wex-design/ui` 进入 `ssr.noExternal`（或 `ssr: { noExternal: ['@wex-design/ui'] }`），以便正确处理 `.vue` 与 CSS 副作用。

## 其他 Vue SSR 方案

| 方案 | 说明 |
| --- | --- |
| **Quasar (SSR mode)** | 在 `quasar.config` 的 `build.transpileDependencies` 中加入 `@wex-design/ui`，入口引入样式 |
| **vite-plugin-ssr / vike** | 与 Vite SSR 相同：服务端渲染 + 客户端 `createWexDesign({ components: false })` |
| **Inertia + Vue SSR** | 根组件包 `WdConfigProvider`；命令式 API 仅在 `onMounted` 后调用 |

## 已知限制

- **不支持 Vue 2**；SSR 仅适用于 Vue 3。
- **IE** 不在支持范围内（与 Vue 3 一致）。
- 主题 `localStorage` 持久化仅在浏览器生效；SSR 首屏使用 `WdConfigProvider` 或 cookie 同步主题可避免闪动。
- 全量 E2E SSR 回归仍在完善；若遇到 hydration 警告，请提供最小复现并 [提 Issue](https://github.com/wex-design/wex-design-ui/issues)。

## 下一步

- [快速上手](/docs/quick-start)：安装与导入方式
- [全局配置](/docs/config)：`WdConfigProvider`
- [主题](/docs/theme)：亮暗色与 token
