---
title: Menubar
category: 09 / MENU
description: 水平菜单栏，支持一级下拉。
---

# Menubar

水平导航菜单，子项以一层下拉展示。

## 引入

```ts
import { WiMenubar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMenubar } from '@well-insight/ui'

const model = [
  {
    label: '文件',
    items: [{ label: '新建' }, { label: '打开' }],
  },
  { label: '编辑' },
]
</script>

<template>
  <WiMenubar :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | 菜单项，可含一层 `items`。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
