---
title: ConfirmPopup
category: 04 / OVERLAY
description: Confirmation popover anchored to a target.
---

# ConfirmPopup

Lightweight confirmation overlay. Supports `target` or coordinate positioning.

## Import

```ts
import { WdConfirmPopup } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdConfirmPopup } from '@well-insight/ui'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}
</script>

<template>
  <WdButton label="Delete" severity="danger" @click="ask" />
  <WdConfirmPopup v-model="open" :target="target" message="Delete this item?" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the popup is shown. |
| `message` | `string` | — | Prompt text. |
| `acceptLabel` / `rejectLabel` | `string` | `OK` / `Cancel` | Buttons. |
| `target` | `HTMLElement \| null` | — | Anchor element. |
| `position` | `{ top, left } \| null` | — | Coordinates when there is no anchor. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility. |
| `accept` / `reject` | — | Accept / reject. |
