---
title: 快速上手
order: 2
description: 安装依赖、引入样式，并渲染第一个组件。
---

# 快速上手

> 在线文档：[morya-space.github.io/morya-ui](https://morya-space.github.io/morya-ui/) · 源码：[GitHub](https://github.com/morya-space/morya-ui) · npm：[`morya-ui`](https://www.npmjs.com/package/morya-ui)

## 安装

**在应用项目中（npm / pnpm / yarn）：**

```bash
pnpm add morya-ui
```

需要 Vue 3（推荐 3.5 及以上）。主题 token、亮暗切换与动效 API 均包含在 `morya-ui` 中。

克隆本仓库后执行 `pnpm install`。文档站通过 Vite alias 直连 `src/` 源码（见 `playground/vite.config.ts`）。

在其他业务项目中联调本库时，使用 `link:` / `pnpm link` 并配置 Vite alias；从 npm 安装则始终解析 `dist/`。

## 选择使用方式

本库同时支持**全量**与**按需**两种消费方式，按项目需求任选其一（同一应用内建议保持一致）。

| | 全量 | 按需 |
| --- | --- | --- |
| 典型场景 | 组件用得较多、希望快速上手 | 打包体积敏感、只用少量组件 |
| 组件来源 | `app.use(MoryaUI)` 或 `morya-ui` 按名导入 | `morya-ui/button` 等子路径，或 Vite 自动解析 |
| 样式 | 入口引入 `morya-ui/styles.css` | 子路径自动带入（含 theme + 依赖组件样式） |
| JS 体积 | 全量注册会打入完整组件；按名导入可 tree-shake | 仅打入用到的组件及其依赖 |

## 全量用法

### 1. 插件注册（推荐的全量方式）

在应用入口引入**全量样式**，并通过插件一次注册所有组件：

```ts
import MoryaUI from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App).use(MoryaUI).mount('#app')
```

模板中可直接使用 `<MButton>`、`<MInput>` 等，无需逐个 import。

### 2. 按名导入 + 全量样式

不注册插件、在 SFC 中按需写 import，JS 可由构建工具 tree-shake，但样式仍需全量 CSS：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { MButton, MInput } from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <MInput v-model="name" label="名称" placeholder="输入名称" />
    <MButton label="提交" @click="() => undefined" />
  </div>
</template>
```

## 按需用法

### 1. 子路径导入

从 kebab-case 子路径导入（如 `button`、`input-password`、`tree-select`）。会带上组件 JS、内部依赖与对应样式，**无需**再引 `morya-ui/styles.css`：

```ts
import { MButton } from 'morya-ui/button'
import { MInput } from 'morya-ui/input'
```

仅要样式时：

```ts
import 'morya-ui/button/style'
import 'morya-ui/button/style.css'
```

### 2. 自动按需（Vite）

安装 `unplugin-vue-components` 后，在 `vite.config.ts` 中配置解析器，模板里可直接写 `<MButton>`：

```ts
import { MoryaUIResolver } from 'morya-ui/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [MoryaUIResolver()],
    }),
  ],
})
```

按需模式下，`createMoryaUI({ components: false })` 仍可注入全局配置而不注册组件。

## 可选：应用级全局配置

`createMoryaUI` 会写入全局默认值，并默认注册全部组件：

```ts
import { createMoryaUI } from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App)
  .use(
    createMoryaUI({
      appendTo: 'body',
      size: 'small',
      zIndex: 1100,
    }),
  )
  .mount('#app')
```

仅配置、不注册组件时使用 `components: false`。

更多说明见 [全局配置](/docs/config)。

## 主题 API

亮暗切换等能力从同一包引入：

```ts
import { useTheme } from 'morya-ui'

const { toggleTheme } = useTheme()
```

详见 [主题](/docs/theme)。

## 启动本仓库文档站

```bash
pnpm --filter morya-ui dev
# http://localhost:5182

# 构建静态文档站
pnpm --filter morya-ui build:docs
```
