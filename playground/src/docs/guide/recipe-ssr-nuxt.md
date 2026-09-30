---
title: Nuxt SSR
order: 25
description: 用 @morya-ui/nuxt 搭一条最小可跑的 SSR 接入路径。
---

# Nuxt SSR

在 Nuxt 3 里最小闭环接入 Morya UI：安装模块、配置按需 resolver、根级 `MConfigProvider`，再放一个 `MButton` 页面。文档站无法内嵌完整 Nuxt 预览，本页以配置与片段为主；Astro / Vite SSR 见 [SSR 总览](/docs/ssr)。

## 目标

- `morya-ui` + `@morya-ui/nuxt` 安装到位
- 模块负责样式、transpile、客户端 overlay
- `app.vue` 包 `MConfigProvider`，页面能渲染 `MButton`

## 何时使用

- 新 Nuxt 3 应用要从零接库
- 已有 Nuxt 项目需要稳定的 SSR 样式、transpile 与 `toast` / `message` 上下文

## 步骤

### 1. 安装

```bash
pnpm add morya-ui @morya-ui/nuxt
pnpm add -D unplugin-vue-components
```

### 2. `nuxt.config.ts`

```ts
import { MoryaUIResolver } from "morya-ui/resolver";
import Components from "unplugin-vue-components/vite";

export default defineNuxtConfig({
  modules: ["@morya-ui/nuxt"],
  // 可选：moryaUI: { css: true, transpile: true }
  vite: {
    plugins: [
      Components({
        resolvers: [MoryaUIResolver()],
      }),
    ],
  },
});
```

模块默认会：引入 `morya-ui/styles.css`；把 `morya-ui` 加入 `build.transpile`；在**客户端**注册 overlay 上下文（`createMoryaUI({ components: false })`，供 `toast` / `message`）。

### 3. `app.vue`

```vue
<script setup lang="ts">
const theme = ref<"light" | "dark">("light");
</script>

<template>
  <MConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </MConfigProvider>
</template>
```

按需导入时不必 `app.use(MoryaUI)`。若要全量注册，另写 `plugins/morya-ui.client.ts`。

### 4. 示例页面

```vue
<!-- pages/index.vue -->
<template>
  <main style="padding: 1.5rem">
    <MButton label="Hello Morya" />
  </main>
</template>
```

`MButton` 可由 `MoryaUIResolver` 自动导入，也可显式 `import { MButton } from 'morya-ui'`。

## 检查清单

- [ ] 模块 `css: true`（默认）或已自行引入 `morya-ui/styles.css`
- [ ] `transpile: true`，避免 SSR 打进未编译的 `.vue` / CSS 副作用
- [ ] 首屏主题 / 密度走 `MConfigProvider`，少在 SSR 阶段单独 `useTheme()` 写 `document`
- [ ] `toast` / `message` / `confirm` 仅浏览器生效；模块已带客户端 overlay 插件
- [ ] `appendTo` 到尚未存在的节点等场景用 `<ClientOnly>` 包裹

## 相关

- [SSR 与服务端框架](/docs/ssr)（Astro / Vite SSR）
- [快速上手](/docs/quick-start) · [全局配置](/docs/config) · [主题](/docs/theme)
- [`@morya-ui/nuxt`](https://www.npmjs.com/package/@morya-ui/nuxt)（仓库 `packages/nuxt`）
