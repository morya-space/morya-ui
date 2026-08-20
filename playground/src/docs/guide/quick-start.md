---
title: 快速上手
order: 2
description: 安装依赖、引入样式，并渲染第一个组件。
---

# 快速上手

## 安装

**在应用项目中（npm / pnpm / yarn）：**

```bash
pnpm add @well-insight/ui
```

需要 Vue 3.5+。主题 token、亮暗切换与动效 API 均包含在 `@well-insight/ui` 中。

克隆本仓库后执行 `pnpm install`，开发态通过 `exports.development` 直连源码热更新。

## 引入样式

在应用入口引入组件库样式：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).mount('#app')
```

## 使用组件

### 全量注册

```ts
import { createApp } from 'vue'
import WellInsight from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).use(WellInsight).mount('#app')
```

模板中可直接使用 `<WiButton>`、`<WiInput>` 等，无需逐个 import。

### 按需引入

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput } from '@well-insight/ui'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WiInput v-model="name" label="名称" placeholder="输入名称" />
    <WiButton label="提交" @click="() => undefined" />
  </div>
</template>
```

## 可选：应用级全局配置

`createWellInsight` 会写入全局默认值，并默认注册全部组件：

```ts
import { createApp } from 'vue'
import { createWellInsight } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App)
  .use(
    createWellInsight({
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
import { useTheme } from '@well-insight/ui'

const { toggleTheme } = useTheme()
```

详见 [主题](/docs/theme)。

## 启动本仓库文档站

```bash
pnpm --filter @well-insight/ui dev
# http://localhost:5182

# 构建静态文档站
pnpm --filter @well-insight/ui build:docs
```
