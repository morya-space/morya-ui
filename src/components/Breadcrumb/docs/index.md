---
title: Breadcrumb
category: 09 / MENU
description: 展示当前页面在层级中的位置。
---

# Breadcrumb

面包屑导航。有 `to` 时渲染为链接，否则为文本。

## 引入

```ts
import { WdBreadcrumb } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdBreadcrumb } from '@well-insight/ui'

const items = [
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computer', to: '/electronics/computer' },
  { label: 'Accessories' },
]
</script>

<template>
  <WdBreadcrumb :home="{ label: 'Home', to: '/' }" :model="items" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `{ label: string; to?: string; disabled?: boolean }[]` | — | 路径项。 |
| `home` | `{ label?: string; to?: string }` | — | 首页项；默认文案 `Home`。 |
