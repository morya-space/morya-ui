---
title: ConfigProvider
category: 00 / GUIDE
description: 全局配置入口。统一浮层挂载、尺寸、密度、文案等应用级默认值。
---

# ConfigProvider

通过 `WdConfigProvider` 或 `createWexDesign` 为整棵组件树提供全局默认值。局部 Props 优先级高于全局配置。

## 能力一览

| 能力 | 说明 |
| --- | --- |
| `appendTo` | 浮层默认 Teleport 目标，默认 `body` |
| `size` | 表单控件默认尺寸 |
| `density` | 全局内容密度 `compact` / `comfortable` / `spacious` |
| `inputVariant` | 输入框默认 `outlined` / `filled` |
| `zIndex` | 浮层基础层级 |
| `locale` | 确认 / 空态 / 加载 / 占位等文案。可传入内置语言包 `zhCN` / `enUS` |
| `componentDefaults` | 按组件覆盖默认 props（如 `Input.size`、`Space.size`）。局部 Props 优先 |

## Size

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput, WdSelect } from '@wex-design/ui'
import { ref } from 'vue'

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

## Component Defaults

按组件名覆盖默认 props。键名用无前缀名称（`Input`、`Space`）或 `Wd*` 别名均可。

优先级：**组件 Props > `componentDefaults[组件]` > 全局 `size` / `inputVariant` > 内置默认值**。

`Space` / `Flex` 的 `size` 是间距，**不会**继承全局控件 `size`。

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput, WdSpace } from '@wex-design/ui'
import { ref } from 'vue'

const note = ref('可清除')
</script>

<template>
  <WdConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <WdSpace>
      <WdButton label="仍是 large" />
      <WdInput v-model="note" placeholder="Input 默认 small + clearable" style="width:14rem" />
    </WdSpace>
  </WdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput } from '@wex-design/ui'
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
import { WdButton, WdConfigProvider, WdDialog, WdSelect } from '@wex-design/ui'
import { ref } from 'vue'

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
      <p style="margin:0">
        浮层挂载目标由 ConfigProvider 提供。
      </p>
    </WdDialog>
  </WdConfigProvider>
</template>
```

## 应用级插件

```ts
import WexDesign, { createWexDesign, enUS } from '@wex-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

// 方式一：默认导出
createApp(App).use(WexDesign, { locale: enUS }).mount('#app')

// 方式二：工厂函数
createApp(App)
  .use(
    createWexDesign({
      appendTo: 'body',
      size: 'small',
      density: 'comfortable',
      zIndex: 1100,
      locale: enUS,
      componentDefaults: {
        Space: { size: 'small' },
        Input: { clearable: true },
      },
    }),
  )
  .mount('#app')
```

默认会**全局注册全部组件**（模板可直接用 `<WdButton>`）。仅注入配置时传 `components: false`；也可传组件数组做部分注册。

## 读取配置

```ts
import { useWdConfig } from '@wex-design/ui'

const config = useWdConfig()
```

优先级：**组件 Props > `WdConfigProvider` > `createWexDesign()` > 内置默认值**。

## 主题与动效

主题与动效 API 由 `@wex-design/ui` 一并导出，可与 ConfigProvider 并用：

```ts
import { useMotion, useTheme } from '@wex-design/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `config` | `Partial<WdGlobalConfig>` | — | 一次性传入完整配置（与下列 shorthand 等价）。 |
| `appendTo` | `string \| HTMLElement` | `'body'` | 浮层默认 Teleport 目标。 |
| `size` | `WdSizeInput` | — | 表单控件默认尺寸。 |
| `inputVariant` | `'outlined' \| 'filled'` | — | 输入框默认视觉变体。 |
| `zIndex` | `number` | — | 浮层基础 z-index。 |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | — | 全局内容密度。 |
| `theme` | `'light' \| 'dark' \| 'system'` | — | 主题；`system` 跟随系统偏好。 |
| `locale` | `WdLocale` | — | 文案语言包（如 `zhCN` / `enUS`）。 |
| `componentDefaults` | `Record<string, object>` | — | 按组件名覆盖默认 props。 |
| `globalDensity` | `boolean` | `true` | 是否将 density / theme 写入 `documentElement`。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 子组件树。 |
