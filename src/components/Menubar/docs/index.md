---
title: Menubar
category: 09 / MENU
description: 水平菜单栏，支持一级下拉。
---

# Menubar

水平导航菜单，子项以一层下拉展示。`selectedKey` / `icon` 用于高亮与图标；响应式折叠本期不做。

## 引入

```ts
import { WiMenubar } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiMenubar } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref<string | null>(null)
const model = [
  {
    key: 'file',
    label: '文件',
    icon: 'edit',
    items: [{ key: 'new', label: '新建' }, { key: 'open', label: '打开' }],
  },
  { key: 'edit', label: '编辑', icon: 'home' },
]
</script>

<template>
  <WiMenubar v-model:selected-key="selectedKey" :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | 菜单项，可含一层 `items`；项可含 `key` / `icon`。 |
| `selectedKey` | `string \| null` | — | 选中项（`item.key` 或 `item.label`）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:selectedKey` | `string \| null` | 选中项变化。 |
| `select` | `MenubarItem` | 点击叶子项。 |
