---
title: TieredMenu
category: 09 / MENU
description: 带一层子菜单的垂直分层菜单。
---

# TieredMenu

支持悬停 / 点击展开一层子菜单。

## 引入

```ts
import { WdTieredMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTieredMenu } from '@well-insight/ui'

const model = [
  {
    label: '文件',
    items: [{ label: '新建' }, { label: '导出' }],
  },
  { label: '帮助' },
]
</script>

<template>
  <WdTieredMenu :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `TieredMenuItem[]` | — | 菜单项，可含一层 `items`。 |
| `popup` | `boolean` | `false` | 是否弹出模式。 |
| `modelValue` | `boolean` | `false` | popup 可见性。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
