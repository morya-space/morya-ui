---
title: ContextMenu
category: 09 / MENU
description: 右键上下文菜单，支持 show(event) / hide()。
---

# ContextMenu

在指针位置弹出的上下文菜单。支持嵌套 `items`。也可用 `useContextMenu()` 绑定 `v-model` / `v-model:position`。

## 引入

```ts
import { useContextMenu, WiContextMenu } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiContextMenu } from '@well-insight/ui'
import { ref } from 'vue'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const menu = ref<{ show: (e: MouseEvent) => void } | null>(null)

const model = [
  { label: '复制' },
  { label: '粘贴' },
  { separator: true },
  { label: '删除', disabled: true },
]

function onContext(event: MouseEvent) {
  menu.value?.show(event)
}
</script>

<template>
  <div
    style="border: 1px dashed var(--wi-color-border); padding: 2rem; border-radius: var(--wi-radius-md)"
    @contextmenu.prevent="onContext"
  >
    右键此处打开菜单
  </div>
  <WiContextMenu
    ref="menu"
    v-model="visible"
    v-model:position="position"
    :model="model"
  />
</template>
```

## Nested + useContextMenu

```vue preview
<script setup lang="ts">
import { useContextMenu, WiContextMenu } from '@well-insight/ui'

const menu = useContextMenu()
const model = [
  { label: '复制', command: () => undefined },
  { label: '更多', items: [{ label: '深层' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--wi-color-border); padding: 2rem; border-radius: var(--wi-radius-md)"
    @contextmenu="menu.show"
  >
    右键此处（composable）
  </div>
  <WiContextMenu v-model="menu.visible" v-model:position="menu.position" :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `ContextMenuItem[]` | — | 菜单项，可嵌套 `items`；项可含 `key` / `icon`。 |
| `modelValue` | `boolean` | `false` | 是否可见。 |
| `position` | `{ x: number; y: number }` | — | 菜单坐标。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `update:position` | `{ x; y }` | 位置变化。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `show(event)` | 根据鼠标事件或坐标显示。 |
| `hide()` | 隐藏菜单。 |

`useContextMenu()` 返回 `{ visible, position, show, hide }`，便于命令式打开。
