---
title: Flex
category: 01 / BASIC
description: 基于 flex 的弹性布局容器，控制方向、对齐与间距。
---

# Flex

弹性布局容器。优先使用 CSS `gap` 控制子项间距。

## 引入

```ts
import { MFlex } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex>
    <MButton label="一" size="small" />
    <MButton label="二" size="small" severity="secondary" />
    <MButton label="三" size="small" severity="secondary" />
  </MFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical>
    <MButton label="上" size="small" />
    <MButton label="中" size="small" severity="secondary" />
    <MButton label="下" size="small" severity="secondary" />
  </MFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { MButton, MFlex, MTag } from 'morya-ui'
</script>

<template>
  <MFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <MTag value="标签" />
    <MButton label="操作" size="small" />
  </MFlex>
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
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 布局子节点。 |
