---
title: TieredMenu
category: 09 / MENU
description: A vertical layered menu with one submenu level.
---

# TieredMenu

Vertical menu with **one** submenu level on hover or click. Use `popup` for overlay mode.

## Import

```ts
import { WiTieredMenu, type TieredMenuItem } from '@well-insight/ui'
```

## Basic usage

```vue preview
<script setup lang="ts">
import { WiTieredMenu } from '@well-insight/ui'

const model = [
  {
    label: 'File',
    items: [
      { label: 'New', command: () => window.alert('New') },
      { label: 'Export' },
    ],
  },
  { separator: true },
  { label: 'Help' },
]
</script>

<template>
  <WiTieredMenu :model="model" />
</template>
```

## Popup mode

Combine `popup` with `v-model` for toolbar triggers:

```vue preview
<script setup lang="ts">
import { WiButton, WiTieredMenu } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const model = [{ label: 'Copy' }, { label: 'Paste' }]
</script>

<template>
  <WiButton label="Actions" @click="open = true" />
  <WiTieredMenu v-model="open" popup :model="model" />
</template>
```

## Item shape

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Display text. |
| `command` | `() => void` | Runs when a leaf item is activated. |
| `disabled` | `boolean` | Disabled item. |
| `separator` | `boolean` | Renders a divider (ignores other fields). |
| `items` | `TieredMenuItem[]` | One submenu level. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `TieredMenuItem[]` | — | Menu items. |
| `popup` | `boolean` | `false` | Popup overlay mode. |
| `modelValue` | `boolean` | `false` | Popup visibility (`v-model`). |
| `teleport` | `boolean` | `true` | Teleport when `popup`; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility change. |

## Slots

No slots.
