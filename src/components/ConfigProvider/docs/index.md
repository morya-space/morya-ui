---
title: ConfigProvider
category: 00 / GUIDE
description: 全局配置入口。统一浮层挂载、尺寸、密度、文案等应用级默认值。
---

# ConfigProvider

通过 `WdConfigProvider` 或 `createWellInsight` 为整棵组件树提供全局默认值。局部 Props 优先级高于全局配置。

## 能力一览

| 能力 | 说明 |
| --- | --- |
| `appendTo` | 浮层默认 Teleport 目标，默认 `body` |
| `size` | 表单控件默认尺寸 |
| `density` | 全局内容密度 `compact` / `comfortable` / `spacious` |
| `inputVariant` | 输入框默认 `outlined` / `filled` |
| `zIndex` | 浮层基础层级 |
| `locale` | 确认 / 空态 / 加载 / 占位等文案。可传入内置语言包 `zhCN` / `enUS` |

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdConfigProvider, WdButton, WdInput, WdSelect } from '@well-insight/ui'

const city = ref<string | undefined>()
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <WdConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdButton label="继承 small" />
      <WdInput placeholder="继承 small" style="width:10rem" />
      <WdSelect v-model="city" :options="options" placeholder="继承 small" style="width:10rem" />
      <WdButton label="覆盖为 large" size="large" />
    </div>
  </WdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WdConfigProvider, WdButton, WdInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WdConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WdButton label="compact" />
        <WdInput placeholder="compact" style="width:10rem" />
      </div>
    </WdConfigProvider>
    <WdConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WdButton label="spacious" />
        <WdInput placeholder="spacious" style="width:10rem" />
      </div>
    </WdConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdConfigProvider, WdButton, WdSelect, WdDialog } from '@well-insight/ui'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <WdConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdSelect v-model="city" :options="options" placeholder="filled 输入" style="width:12rem" />
      <WdButton label="打开对话框" @click="visible = true" />
    </div>
    <WdDialog v-model="visible" title="继承 appendTo" style="width: 24rem">
      <p style="margin:0">浮层挂载目标由 ConfigProvider 提供。</p>
    </WdDialog>
  </WdConfigProvider>
</template>
```

## 应用级插件

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

## 读取配置

```ts
import { useWdConfig } from '@well-insight/ui'

const config = useWdConfig()
```

优先级：**组件 Props > `WdConfigProvider` > `createWellInsight()` > 内置默认值**。

## 主题与动效

主题与动效 API 由 `@well-insight/ui` 一并导出，可与 ConfigProvider 并用：

```ts
import { useTheme, useMotion } from '@well-insight/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```
