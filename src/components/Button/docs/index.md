---
title: Button
category: 01 / PRIMITIVE
description: 按钮用于触发即时动作。
---

# Button

按钮用于触发即时动作。

## 引入

```ts
import { WiButton } from '@well-insight/ui'
```

## Basic

通过默认插槽或 `label` 展示按钮文案。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton>Submit</WiButton>
    <WiButton label="Label Prop" />
    <WiButton severity="secondary" label="Secondary" />
  </div>
</template>
```

## Severity

使用 `severity` 定义按钮语义色；省略时为 primary。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Primary" />
    <WiButton label="Secondary" severity="secondary" />
    <WiButton label="Success" severity="success" />
    <WiButton label="Info" severity="info" />
    <WiButton label="Warn" severity="warn" />
    <WiButton label="Help" severity="help" />
    <WiButton label="Danger" severity="danger" />
    <WiButton label="Contrast" severity="contrast" />
  </div>
</template>
```

## Styles

`outlined`、`text`、`link`、`raised`、`rounded`、`plain` 可自由组合。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Outlined" outlined />
      <WiButton label="Success" severity="success" outlined />
      <WiButton label="Danger" severity="danger" outlined />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Raised" raised />
      <WiButton label="Rounded" rounded />
      <WiButton label="Plain Text" text plain />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Small" size="small" />
      <WiButton label="Large" size="large" />
      <WiButton label="Fluid" fluid />
    </div>
  </div>
</template>
```

## Text & Link

`text` 为轻量文字按钮；`link` 呈现为内联链接样式。二者均可与 `severity` 组合。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Text" text />
    <WiButton label="Text Danger" text severity="danger" />
    <WiButton label="Link" link />
    <WiButton label="Link Secondary" link severity="secondary" />
  </div>
</template>
```

## Ghost & Quaternary

`ghost` 为透明底 + 描边色文字；`quaternary` 更克制，适合工具栏次要操作。也可通过 `variant` 指定。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Ghost" ghost />
    <WiButton label="Ghost Danger" ghost severity="danger" />
    <WiButton label="Quaternary" quaternary />
    <WiButton label="Custom" color="#e11d48" />
  </div>
</template>
```

## Button Group

`WiButtonGroup` 将相邻按钮拼成一组。

```vue preview
<script setup lang="ts">
import { WiButton, WiButtonGroup } from '@well-insight/ui'
</script>

<template>
  <WiButtonGroup aria-label="对齐">
    <WiButton label="左" />
    <WiButton label="中" severity="secondary" />
    <WiButton label="右" severity="secondary" />
  </WiButtonGroup>
</template>
```

## Icons & Badge

支持 `icon`、`iconPos`、`iconOnly`，以及 `badge` 徽标。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton icon="check" label="Save" />
    <WiButton icon="search" label="Search" icon-pos="right" severity="secondary" />
    <WiButton icon="plus" icon-only rounded aria-label="Add" />
    <WiButton icon="trash" icon-only rounded outlined severity="danger" aria-label="Delete" />
    <WiButton label="Messages" badge="2" badge-severity="danger" severity="secondary" />
  </div>
</template>
```

## Loading

`loading` 状态下显示 spinner 并阻止点击。

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
import { ref } from 'vue'

const loading = ref(false)

function toggleLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 900)
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Search" icon="search" :loading="loading" @click="toggleLoading" />
    <WiButton label="Always Loading" loading severity="secondary" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Disabled" disabled />
    <WiButton label="Disabled Outlined" outlined disabled />
    <WiButton label="Disabled Text" text disabled />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 按钮文案。存在默认插槽内容时以插槽为准。 |
| `icon` | `IconName \| Component` | — | 图标名称或自定义组件。 |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | 图标相对标签的位置。 |
| `iconOnly` | `boolean` | `false` | 强制方形纯图标按钮。 |
| `severity` | `'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` | — | 语义色。省略时为 primary。 |
| `variant` | `'outlined' \| 'text' \| 'link' \| 'ghost' \| 'quaternary'` | — | 样式变体快捷方式，等价于对应布尔 prop。 |
| `outlined` | `boolean` | `false` | 描边按钮。 |
| `text` | `boolean` | `false` | 文字按钮。 |
| `link` | `boolean` | `false` | 链接按钮。 |
| `ghost` | `boolean` | `false` | 透明底按钮。 |
| `quaternary` | `boolean` | `false` | 极轻量文字按钮。 |
| `color` | `string` | — | 自定义颜色，覆盖 `severity`。 |
| `raised` | `boolean` | `false` | 浮起阴影。 |
| `rounded` | `boolean` | `false` | 全圆角。 |
| `plain` | `boolean` | `false` | 弱化色，常与 `text` / `outlined` 组合。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。默认中等；兼容 `sm` / `lg`。 |
| `fluid` | `boolean` | `false` | 宽度撑满容器。 |
| `block` | `boolean` | `false` | **已弃用**，请使用 `fluid`。 |
| `loading` | `boolean` | `false` | 加载中，禁用点击并显示 spinner。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `badge` | `string` | — | 徽标文本。 |
| `badgeSeverity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null` | `null` | 徽标语义色。 |
| `autofocus` | `boolean` | `false` | 原生 autofocus。 |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type。 |
| `ariaLabel` | `string` | — | 可访问名称；图标按钮建议提供。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 启用状态下点击触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容，优先于 `label`。 |
| `icon` | 自定义图标。 |
| `loadingicon` | 自定义加载图标。 |

## Instance

| 方法 / 属性 | 说明 |
| --- | --- |
| `focus()` | 聚焦底层 button。 |
| `ref` | 底层 `HTMLButtonElement`。 |

## 无障碍

- 渲染原生 `<button>`。
- 纯图标按钮请设置 `ariaLabel`（或可访问的文本标签）。
- `loading` 时设置 `aria-busy`，并禁用交互。
