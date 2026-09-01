---
title: Divider
category: 01 / PRIMITIVE
description: 内容分隔线。
---

# Divider

内容分隔线，可带标签。

## 引入

```ts
import { WiDivider } from '@well-insight/ui'
```

## 基础用法

默认水平实线分隔。

```vue preview
<script setup lang="ts">
import { WiDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <p style="margin:0">
      Above
    </p>
    <WiDivider />
    <p style="margin:0">
      Below
    </p>
  </div>
</template>
```

## Type

`type` 支持 `solid`、`dashed`、`dotted`。

```vue preview
<script setup lang="ts">
import { WiDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WiDivider type="solid" label="Solid" />
    <WiDivider type="dashed" label="Dashed" />
    <WiDivider type="dotted" label="Dotted" />
  </div>
</template>
```

## Align

水平分隔且带标签时，可用 `align` 控制标签位置。

```vue preview
<script setup lang="ts">
import { WiDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WiDivider label="Left" align="left" />
    <WiDivider label="Center" align="center" />
    <WiDivider label="Right" align="right" />
  </div>
</template>
```

## Title placement

`titlePlacement` 是 `align` 的别名。

```vue preview
<script setup lang="ts">
import { WiDivider } from '@well-insight/ui'
</script>

<template>
  <WiDivider label="Or" title-placement="right" />
</template>
```

## Layout

`layout` 控制水平 / 垂直。

```vue preview
<script setup lang="ts">
import { WiDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;align-items:stretch;gap:1rem;min-height:6rem">
    <span>Left</span>
    <WiDivider layout="vertical" />
    <span>Middle</span>
    <WiDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局方向。 |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 线条样式。 |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | 水平分隔带标签时的标签对齐。 |
| `titlePlacement` | `'left' \| 'center' \| 'right'` | — | `align` 的别名；传入时优先。 |
| `label` | `string` | — | 中间标签文案。存在默认插槽时以插槽为准。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `label`。 |

## Events

无自定义事件。
