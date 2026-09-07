---
title: Flex
category: 01 / BASIC
description: 基于 flex 的弹性布局容器，控制方向、对齐与间距。
---

# Flex

弹性布局容器。优先使用 CSS `gap` 控制子项间距。

## 引入

```ts
import { RdFlex } from '@roost-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex } from '@roost-design/ui'
</script>

<template>
  <RdFlex>
    <RdButton label="一" size="small" />
    <RdButton label="二" size="small" severity="secondary" />
    <RdButton label="三" size="small" severity="secondary" />
  </RdFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex } from '@roost-design/ui'
</script>

<template>
  <RdFlex vertical>
    <RdButton label="上" size="small" />
    <RdButton label="中" size="small" severity="secondary" />
    <RdButton label="下" size="small" severity="secondary" />
  </RdFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex, RdTag } from '@roost-design/ui'
</script>

<template>
  <RdFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <RdTag value="标签" />
    <RdButton label="操作" size="small" />
  </RdFlex>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | 交叉轴对齐。 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 主轴对齐。 |
| `inline` | `boolean` | `false` | 是否为 `inline-flex`。 |
| `vertical` | `boolean` | `false` | 纵向排列。 |
| `reverse` | `boolean` | `false` | 主轴反向。 |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | 子项间距（`gap`）。 |
| `wrap` | `boolean` | `true` | 是否换行（纵向时强制不换行）。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 布局子节点。 |
