---
title: CommandMenu
category: 09 / MENU
description: Searchable command palette dialog.
---

# CommandMenu

Command palette: search and run commands from the model.

## Import

```ts
import { WiCommandMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCommandMenu } from '@well-insight/ui'

const visible = ref(false)
const model = [
  { label: 'New File', icon: '+', shortcut: '⌘N' },
  { label: 'Open Settings', icon: '⚙', shortcut: '⌘,' },
  { label: 'Toggle Theme', icon: '◐' },
]
</script>

<template>
  <WiButton label="Open Command Menu" @click="visible = true" />
  <WiCommandMenu v-model="visible" :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `CommandMenuItem[]` | `[]` | Command list. |
| `modelValue` | `boolean` | `false` | Visibility. |
| `placeholder` | `string` | locale `searchCommands` | Search input placeholder. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
