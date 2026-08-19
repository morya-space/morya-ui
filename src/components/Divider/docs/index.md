---
title: Divider
category: 01 / PRIMITIVE
description: 内容分隔线。
---

# Divider

内容分隔线，可带标签。

## 引入

```ts
import { WdDivider } from '@well-insight/ui'
```

## Basic

默认水平实线分隔。

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <p style="margin:0">Above</p>
    <WdDivider />
    <p style="margin:0">Below</p>
  </div>
</template>
```

## Type

`type` 支持 `solid`、`dashed`、`dotted`。

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WdDivider type="solid" label="Solid" />
    <WdDivider type="dashed" label="Dashed" />
    <WdDivider type="dotted" label="Dotted" />
  </div>
</template>
```

## Align

水平分隔且带标签时，可用 `align` 控制标签位置。

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WdDivider label="Left" align="left" />
    <WdDivider label="Center" align="center" />
    <WdDivider label="Right" align="right" />
  </div>
</template>
```

## Layout

`layout`（或兼容的 `orientation`）控制水平 / 垂直。

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;align-items:stretch;gap:1rem;min-height:6rem">
    <span>Left</span>
    <WdDivider layout="vertical" />
    <span>Middle</span>
    <WdDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局方向。 |
| `orientation` | `'horizontal' \| 'vertical'` | — | **兼容别名**；仅在未传 `layout` 时生效。 |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 线条样式。 |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | 水平分隔带标签时的标签对齐。 |
| `label` | `string` | — | 中间标签文案。存在默认插槽时以插槽为准。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `label`。 |
