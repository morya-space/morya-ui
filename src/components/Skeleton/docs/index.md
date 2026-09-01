---
title: Skeleton
category: 07 / MISC
description: 加载占位骨架。支持矩形/圆形、自定义尺寸与 wave 动画。
---

# Skeleton

加载占位骨架，用于内容尚未就绪时的视觉反馈。

## 引入

```ts
import { WiSkeleton } from '@well-insight/ui'
```

## 基础用法

默认矩形、宽度 `100%`，带 `wave` 动画。

```vue preview
<script setup lang="ts">
import { WiSkeleton } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:0.75rem;width:min(24rem,100%)">
    <WiSkeleton height="1.25rem" />
    <WiSkeleton height="1.25rem" width="70%" />
    <WiSkeleton height="6rem" border-radius="0.5rem" />
  </div>
</template>
```

## Shape

`shape` 支持 `rectangle`（默认）与 `circle`。

```vue preview
<script setup lang="ts">
import { WiSkeleton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WiSkeleton shape="circle" width="3rem" height="3rem" />
    <WiSkeleton width="10rem" height="3rem" />
  </div>
</template>
```

## Animation

`animation` 为 `wave`（默认）或 `none`。

```vue preview
<script setup lang="ts">
import { WiSkeleton } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:0.75rem;width:min(24rem,100%)">
    <WiSkeleton height="1.25rem" animation="wave" />
    <WiSkeleton height="1.25rem" animation="none" />
  </div>
</template>
```

## Text & repeat

`text` 渲染为行高骨架；`repeat` 重复多行。

```vue preview
<script setup lang="ts">
import { WiSkeleton } from '@well-insight/ui'
</script>

<template>
  <WiSkeleton text :repeat="3" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | 形状。 |
| `width` | `string` | `'100%'` | 宽度（CSS 值）。 |
| `height` | `string` | — | 高度（CSS 值）。 |
| `borderRadius` | `string` | — | 圆角覆盖。圆形时由样式强制为全圆。 |
| `animation` | `'wave' \| 'none'` | `'wave'` | 加载动画。 |
| `text` | `boolean` | `false` | 按文本行高度渲染。 |
| `repeat` | `number` | `1` | 重复行数。 |
