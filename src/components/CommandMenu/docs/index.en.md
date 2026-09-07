---
title: CommandMenu
category: 04 / NAVIGATION
description: Searchable command palette dialog.
---

# CommandMenu

Searchable command palette for running actions from `model`. Fits global shortcuts such as Cmd/Ctrl+K.

## Import

```ts
import { RdCommandMenu, type CommandMenuItem } from '@roost-design/ui'
```

## Basic usage

```vue preview
<script setup lang="ts">
import { RdButton, RdCommandMenu } from '@roost-design/ui'
import { ref } from 'vue'

const visible = ref(false)
const model = [
  { label: 'New file', icon: '+', shortcut: '⌘N', command: () => window.alert('New') },
  { label: 'Open settings', icon: '⚙', shortcut: '⌘,', command: () => window.alert('Settings') },
  { label: 'Toggle theme', icon: '◐', disabled: true },
]
</script>

<template>
  <RdButton label="Open command menu" @click="visible = true" />
  <RdCommandMenu v-model="visible" :model="model" placeholder="Search commands…" />
</template>
```

## Command item shape

`CommandMenuItem` fields:

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Display text; included in local filtering. |
| `icon` | `string` | Optional leading character (not a RdIcon name). |
| `shortcut` | `string` | Optional shortcut hint. |
| `command` | `() => void` | Runs on activate; closes the palette afterward. |
| `disabled` | `boolean` | Disabled items cannot be activated. |

## Keyboard

When open:

| Key | Action |
| --- | --- |
| `↑` / `↓` | Move highlight |
| `Enter` | Activate highlighted item |
| `Escape` | Close palette |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `CommandMenuItem[]` | `[]` | Command list. |
| `modelValue` | `boolean` | `false` | Visibility (`v-model`). |
| `placeholder` | `string` | locale `searchCommands` | Search input placeholder. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |

## Accessibility

- Panel uses `role="dialog"` and `aria-modal="true"`.
- Focus moves to the search field on open; label the trigger control.

## Slots

No slots.
