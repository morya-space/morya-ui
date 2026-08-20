---
title: MegaMenu
category: 09 / MENU
description: 水平菜单，子项按多列面板展示。
---

# MegaMenu

顶层水平导航，展开后以分栏展示子链接。

## 引入

```ts
import { WiMegaMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMegaMenu } from '@well-insight/ui'

const model = [
  {
    label: '产品',
    items: [
      [{ label: '组件库' }, { label: '主题' }],
      [{ label: '图标' }, { label: '模板' }],
    ],
  },
  { label: '关于' },
]
</script>

<template>
  <WiMegaMenu :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MegaMenuItem[]` | `[]` | 菜单项；`items` 为列数组。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
