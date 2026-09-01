---
title: TieredMenu
category: 09 / MENU
description: 带一层子菜单的垂直分层菜单。
---

# TieredMenu

垂直菜单，支持悬停或点击展开**一层**子菜单。`popup` 模式下可作为浮层弹出。

## 引入

```ts
import { WiTieredMenu, type TieredMenuItem } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiTieredMenu } from '@well-insight/ui'

const model = [
  {
    label: '文件',
    items: [
      { label: '新建', command: () => window.alert('新建') },
      { label: '导出' },
    ],
  },
  { separator: true },
  { label: '帮助' },
]
</script>

<template>
  <WiTieredMenu :model="model" />
</template>
```

## 弹出模式

`popup` + `v-model` 控制浮层显隐，适合工具栏按钮触发：

```vue preview
<script setup lang="ts">
import { WiButton, WiTieredMenu } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const model = [{ label: '复制' }, { label: '粘贴' }]
</script>

<template>
  <WiButton label="操作" @click="open = true" />
  <WiTieredMenu v-model="open" popup :model="model" />
</template>
```

## 菜单项结构

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 展示文案。 |
| `command` | `() => void` | 点击叶子项时执行。 |
| `disabled` | `boolean` | 禁用项。 |
| `separator` | `boolean` | 渲染分隔线（忽略其他字段）。 |
| `items` | `TieredMenuItem[]` | 一层子菜单。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `TieredMenuItem[]` | — | 菜单项。 |
| `popup` | `boolean` | `false` | 弹出模式。 |
| `modelValue` | `boolean` | `false` | popup 可见性（`v-model`）。 |
| `teleport` | `boolean` | `true` | popup 时 Teleport；默认 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | popup 可见性变化。 |

## Slots

无插槽。
