---
title: ConfigProvider
category: 00 / GUIDE
description: 全局配置入口。统一浮层挂载、尺寸、密度、文案等应用级默认值。
---

# ConfigProvider

通过 `RdConfigProvider` 或 `createRoostDesign` 为整棵组件树提供全局默认值。局部 Props 优先级高于全局配置。

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
import { RdButton, RdConfigProvider, RdInput, RdSelect } from '@roost-design/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <RdConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <RdButton label="继承 small" />
      <RdInput placeholder="继承 small" style="width:10rem" />
      <RdSelect v-model="city" :options="options" placeholder="继承 small" style="width:10rem" />
      <RdButton label="覆盖为 large" size="large" />
    </div>
  </RdConfigProvider>
</template>
```

## Component Defaults

按组件名覆盖默认 props。键名用无前缀名称（`Input`、`Space`）或 `Rd*` 别名均可。

优先级：**组件 Props > `componentDefaults[组件]` > 全局 `size` / `inputVariant` > 内置默认值**。

`Space` / `Flex` 的 `size` 是间距，**不会**继承全局控件 `size`。

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput, RdSpace } from '@roost-design/ui'
import { ref } from 'vue'

const note = ref('可清除')
</script>

<template>
  <RdConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <RdSpace>
      <RdButton label="仍是 large" />
      <RdInput v-model="note" placeholder="Input 默认 small + clearable" style="width:14rem" />
    </RdSpace>
  </RdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <RdConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <RdButton label="compact" />
        <RdInput placeholder="compact" style="width:10rem" />
      </div>
    </RdConfigProvider>
    <RdConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <RdButton label="spacious" />
        <RdInput placeholder="spacious" style="width:10rem" />
      </div>
    </RdConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdDialog, RdSelect } from '@roost-design/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <RdConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <RdSelect v-model="city" :options="options" placeholder="filled 输入" style="width:12rem" />
      <RdButton label="打开对话框" @click="visible = true" />
    </div>
    <RdDialog v-model="visible" title="继承 appendTo" style="width: 24rem">
      <p style="margin:0">
        浮层挂载目标由 ConfigProvider 提供。
      </p>
    </RdDialog>
  </RdConfigProvider>
</template>
```

## 应用级插件

```ts
import RoostDesign, { createRoostDesign, enUS } from '@roost-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@roost-design/ui/styles.css'

// 方式一：默认导出
createApp(App).use(RoostDesign, { locale: enUS }).mount('#app')

// 方式二：工厂函数
createApp(App)
  .use(
    createRoostDesign({
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

默认会**全局注册全部组件**（模板可直接用 `<RdButton>`）。仅注入配置时传 `components: false`；也可传组件数组做部分注册。

## 读取配置

```ts
import { useRdConfig } from '@roost-design/ui'

const config = useRdConfig()
```

优先级：**组件 Props > `RdConfigProvider` > `createRoostDesign()` > 内置默认值**。

## 主题与动效

主题与动效 API 由 `@roost-design/ui` 一并导出，可与 ConfigProvider 并用：

```ts
import { useMotion, useTheme } from '@roost-design/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `config` | `Partial<RdGlobalConfig>` | — | 一次性传入完整配置（与下列 shorthand 等价）。 |
| `appendTo` | `string \| HTMLElement` | `'body'` | 浮层默认 Teleport 目标。 |
| `size` | `RdSizeInput` | — | 表单控件默认尺寸。 |
| `inputVariant` | `'outlined' \| 'filled'` | — | 输入框默认视觉变体。 |
| `zIndex` | `number` | — | 浮层基础 z-index。 |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | — | 全局内容密度。 |
| `theme` | `'light' \| 'dark' \| 'system'` | — | 主题；`system` 跟随系统偏好。 |
| `locale` | `RdLocale` | — | 文案语言包（如 `zhCN` / `enUS`）。 |
| `componentDefaults` | `Record<string, object>` | — | 按组件名覆盖默认 props。 |
| `globalDensity` | `boolean` | `true` | 是否将 density / theme 写入 `documentElement`。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 子组件树。 |
