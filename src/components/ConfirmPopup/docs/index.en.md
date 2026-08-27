---
title: ConfirmPopup
category: 04 / OVERLAY
description: Confirmation popover anchored to a target.
---

# ConfirmPopup

Lightweight confirmation overlay. Supports `target` or coordinate positioning.

## Import

```ts
import { WiConfirmPopup } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiConfirmPopup } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}
</script>

<template>
  <WiButton label="Delete" severity="danger" @click="ask" />
  <WiConfirmPopup v-model="open" :target="target" message="Delete this item?" icon="info" placement="top" />
</template>
```

## Before accept

Returning `false` from `beforeAccept` keeps the popup open and skips the `accept` emit.

```vue preview
<script setup lang="ts">
import { WiButton, WiConfirmPopup } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}

async function beforeAccept() {
  return window.confirm('Confirm again?')
}
</script>

<template>
  <WiButton label="With guard" @click="ask" />
  <WiConfirmPopup v-model="open" :target="target" message="Continue?" :before-accept="beforeAccept" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the popup is shown. |
| `message` | `string` | — | Prompt text. |
| `acceptLabel` / `rejectLabel` | `string` | `OK` / `Cancel` | Buttons. |
| `icon` | `IconName` | — | Icon beside the message. |
| `beforeAccept` | `() => boolean \| Promise<boolean>` | — | Return `false` to keep the popup open. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position relative to `target`. |
| `target` | `HTMLElement \| null` | — | Anchor element. |
| `position` | `{ top, left } \| null` | — | Coordinates when there is no anchor. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility. |
| `accept` / `reject` | — | Accept / reject. |
