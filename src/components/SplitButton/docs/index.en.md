---
title: SplitButton
category: 01 / PRIMITIVE
description: A primary action button with extra dropdown items.
---

# SplitButton

The left primary button emits `click`; items in the right-side menu emit `command`.

## Import

```ts
import { WiSplitButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiSplitButton } from '@well-insight/ui'

const items = [
  { label: 'Save as', command: () => console.log('save as') },
  { label: 'Export', command: () => console.log('export') },
]
</script>

<template>
  <WiSplitButton label="Save" :model="items" @click="() => console.log('save')" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Primary button label. |
| `icon` | `string` | — | Optional icon character. |
| `model` | `{ label, command?, disabled? }[]` | `[]` | Menu items. |
| `severity` / `outlined` / `size` | — | — | Visual variants. |
| `disabled` | `boolean` | `false` | Disabled. |
| `teleport` | `boolean` | `true` | Whether to Teleport the menu. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target; `'self'` keeps it in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Primary button click. |
| `command` | `item` | Menu item activated. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Main button content. |
