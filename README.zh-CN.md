<p align="center">
  <a href="https://well-insight.github.io/well-insight-ui/">
    <img src="./assets/logo.svg" alt="Well Insight UI" width="96" height="96" />
  </a>
</p>

<h1 align="center">Well Insight UI</h1>

<p align="center">
  带设计令牌、亮暗主题与交互式文档的 Vue 3 组件库。
</p>

<p align="center">
  <a href="./README.md">English</a> | 中文
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@well-insight/ui"><img src="https://img.shields.io/npm/v/@well-insight/ui?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@well-insight/ui"><img src="https://img.shields.io/npm/dm/@well-insight/ui?style=flat-square" alt="npm downloads" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/well-insight/well-insight-ui?style=flat-square" alt="license" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

<p align="center">
  <a href="https://well-insight.github.io/well-insight-ui/"><b>文档站</b></a>
  ·
  <a href="https://well-insight.github.io/well-insight-ui/components">组件</a>
  ·
  <a href="https://github.com/well-insight/well-insight-ui/issues">Issues</a>
  ·
  <a href="./CHANGELOG.md">更新日志</a>
</p>

---

## 介绍

**Well Insight UI**（`@well-insight/ui`）是一套开源的 Vue 3 组件库，提供 **88 个组件**、基于令牌的主题系统、内置国际化，以及带实时预览的文档站。

无论你是做管理后台、SaaS 产品还是内部工具，都可以直接使用统一的表单、浮层、数据展示与反馈能力。

## 特性

### 组件齐全

覆盖基础、表单、导航、数据展示、布局与反馈等 88 个组件，均支持 ESM 按需引入与 tree-shaking。

### 主题开箱即用

亮/暗色模式基于 `--wi-*` CSS 变量；通过 `useTheme` 切换主题，用 `useDensity` / `useMotion` 调整密度与动效，子树可用 `WiConfigProvider` 覆盖。

### TypeScript 优先

基于 Vue 3 Composition API 与 TypeScript 编写，Props、Emits 与 locale 均有完整类型。

### 多种接入方式

支持全量注册、按名导入、按需子路径，以及配合 `unplugin-vue-components` 的 `WellInsightResolver`——同一应用内建议保持一致。

### 文档即预览

每个组件自带 Markdown 文档与可交互 `vue preview` 示例，可在线浏览或本地启动文档站。

### SSR 与元框架

兼容 **Nuxt 3**、**Astro + Vue**、**Vite SSR** 等场景；提供 [`@well-insight/nuxt`](./packages/nuxt) 模块，详见 [SSR 指南](https://well-insight.github.io/well-insight-ui/docs/ssr)。

## 文档

**https://well-insight.github.io/well-insight-ui/**

| 章节 | 链接 |
| --- | --- |
| 快速上手 | [指南](https://well-insight.github.io/well-insight-ui/docs/quick-start) |
| 主题 | [主题](https://well-insight.github.io/well-insight-ui/docs/theme) |
| 全局配置 | [配置](https://well-insight.github.io/well-insight-ui/docs/config) |
| SSR | [Nuxt / Astro / Vite SSR](https://well-insight.github.io/well-insight-ui/docs/ssr) |
| 组件 | [目录](https://well-insight.github.io/well-insight-ui/components) |
| 更新日志 | [版本](https://well-insight.github.io/well-insight-ui/changelog) |

## 安装

需要 **Vue 3**（推荐 3.5 及以上），以及能解析包 `exports` 的构建工具（Vite、webpack 5+ 等）。

```bash
pnpm add @well-insight/ui
# npm i @well-insight/ui
# yarn add @well-insight/ui
```

## 快速开始

全量注册并引入样式：

```ts
import WellInsight from '@well-insight/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).use(WellInsight).mount('#app')
```

按需引入（样式自动带入）：

```ts
import { WiButton } from '@well-insight/ui/button'
import { WiInput } from '@well-insight/ui/input'
```

应用级默认配置（语言、尺寸、浮层挂载点等）：

```ts
import { createWellInsight, zhCN } from '@well-insight/ui'

createApp(App).use(createWellInsight({ locale: zhCN })).mount('#app')
```

完整接入方式、Vite 解析器与主题 API 见 [快速上手](https://well-insight.github.io/well-insight-ui/docs/quick-start)。

## 生态

| 包 | 说明 |
| --- | --- |
| [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui) | 组件、样式、主题与语言工具 |
| [`@well-insight/nuxt`](./packages/nuxt) | Nuxt 3 模块（样式、transpile、overlay 上下文） |
| [`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp) | 可选 MCP 服务，供 AI 客户端检索文档 |

## 参与贡献

欢迎提交 Issue 与 Pull Request。请先阅读 [CONTRIBUTING.zh-CN.md](./CONTRIBUTING.zh-CN.md)。

维护者文档：[开发指南](./docs/DEVELOPMENT.zh-CN.md) · [发版脚本](./scripts/README.md)

## 本地开发

```bash
pnpm install
pnpm dev              # 文档站 → http://localhost:5182
pnpm build            # 组件库 → dist/
pnpm build:docs:pages # GitHub Pages 构建
pnpm test
pnpm typecheck
```

## 许可证

[MIT](./LICENSE) © Well Insight contributors
