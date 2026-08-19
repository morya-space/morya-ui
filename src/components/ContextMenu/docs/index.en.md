---
title: ContextMenu
category: 09 / MENU
description: Right-click context menu with show(event) / hide().
---

# ContextMenu

Context menu that opens at the pointer position.

## Import

```ts
import { WdContextMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdContextMenu } from '@well-insight/ui'

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const menu = ref<{ show: (e: MouseEvent) => void } | null>(null)

const model = [
  { label: 'Copy' },
  { label: 'Paste' },
  { separator: true },
  { label: 'Delete', disabled: true },
]

function onContext(event: MouseEvent) {
  menu.value?.show(event)
}
</script>

<template>
  <div
    style="border: 1px dashed var(--wd-color-border); padding: 2rem; border-radius: var(--wd-radius-md)"
    @contextmenu.prevent="onContext"
  >
    Right-click here to open the menu
  </div>
  <WdContextMenu
    ref="menu"
    v-model="visible"
    v-model:position="position"
    :model="model"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `ContextMenuItem[]` | — | Menu items. |
| `modelValue` | `boolean` | `false` | Whether the menu is visible. |
| `position` | `{ x: number; y: number }` | — | Menu coordinates. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `update:position` | `{ x; y }` | Position change. |

## Methods

| Method / Property | Description |
| --- | --- |
| `show(event)` | Show from a mouse event or coordinates. |
| `hide()` | Hide the menu. |
