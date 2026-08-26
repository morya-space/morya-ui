---
title: Dropdown
category: 04 / OVERLAY
description: Action menu overlay (not a form select). Unlike Select, it is used to trigger actions such as edit and delete.
---

# Dropdown

Action menu overlay. Opens a set of actions from a trigger.

**Difference from Select:** `WiDropdown` is a menu overlay; for form option selection, use `WiSelect`.

Supports groups (`type: 'group'`), dividers (`separator` / `type: 'divider'`), nested `items`, and `trigger: 'hover'` with `showDelay` / `hideDelay`. Keyboard highlight still covers top-level leaves only.

## Import

```ts
import { WiDropdown, WiButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDropdown } from '@well-insight/ui'

const open = ref(false)
const items = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', disabled: true },
]

function onSelect(item: { value: string; label: string }) {
  open.value = false
  console.log(item.value)
}
</script>

<template>
  <WiDropdown v-model="open" :items="items" @select="onSelect">
    <template #trigger>
      <WiButton label="Actions" icon="chevron-down" icon-pos="right" severity="secondary" />
    </template>
  </WiDropdown>
</template>
```

## Nested / group / hover

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDropdown } from '@well-insight/ui'

const open = ref(false)
const items = [
  { type: 'group' as const, label: 'Edit', items: [{ value: 'cut', label: 'Cut' }, { value: 'copy', label: 'Copy' }] },
  { separator: true },
  { value: 'more', label: 'More', items: [{ value: 'deep', label: 'Deep action' }] },
]
</script>

<template>
  <WiDropdown v-model="open" :items="items" trigger="hover" :show-delay="0" :hide-delay="200">
    <template #trigger>
      <WiButton label="Hover to open" severity="secondary" />
    </template>
  </WiDropdown>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the menu is open. |
| `items` | `DropdownItem[]` | — | Menu items; may include `type` / `separator` / `items` / `icon` / `command`. |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Alignment. |
| `closeOnSelect` | `boolean` | `true` | Close after selection. |
| `trigger` | `'click' \| 'hover'` | `'click'` | How the menu opens. |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | Hover delays in ms. |
| `teleport` | `boolean` | `true` | Teleport the menu; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open state change. |
| `select` | `DropdownItem` | Emitted when an enabled item is selected. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Trigger. |
| `item` | Custom menu item, scope `{ item }`. |
