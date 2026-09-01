---
title: Breadcrumb
category: 09 / MENU
description: 展示当前页面在层级中的位置。
---

# Breadcrumb

面包屑导航。有 `to` 时渲染为链接，否则为文本。

## 引入

```ts
import { WiBreadcrumb } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiBreadcrumb } from '@well-insight/ui'

const items = [
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computer', to: '/electronics/computer' },
  { label: 'Accessories' },
]
</script>

<template>
  <WiBreadcrumb :home="{ label: 'Home', to: '/' }" :model="items" />
</template>
```

## Separator

`separator` 自定义分隔符；也可用 `#separator` 插槽。

```vue preview
<script setup lang="ts">
import { WiBreadcrumb } from '@well-insight/ui'

const items = [
  { label: 'Library', to: '/lib' },
  { label: 'Docs' },
]
</script>

<template>
  <WiBreadcrumb :model="items" separator=">" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `{ label: string; to?: string; disabled?: boolean }[]` | — | 路径项。 |
| `home` | `{ label?: string; to?: string }` | — | 首页项；默认文案 `Home`。 |
| `separator` | `string` | `'/'` | 分隔符。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `separator` | 自定义分隔符。 |
