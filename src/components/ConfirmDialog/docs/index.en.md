---
title: ConfirmDialog
category: 05 / FEEDBACK
description: Confirm / cancel dialog that reuses Dialog overlay styling.
---

# ConfirmDialog

Modal dialog used when the user must explicitly confirm an action.

## Import

```ts
import { WkButton, WkConfirmDialog } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkConfirmDialog } from '@wise-kit/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <WkButton label="Delete" severity="danger" @click="visible = true" />
  <WkConfirmDialog
    v-model="visible"
    header="Confirm delete"
    message="Are you sure you want to delete this item? This action cannot be undone."
    accept-label="Delete"
    reject-label="Cancel"
    accept-severity="danger"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. |
| `header` | `string` | locale `confirm` | Title. |
| `message` | `string` | — | Body text. |
| `acceptLabel` | `string` | locale `accept` | Accept button label. |
| `rejectLabel` | `string` | locale `reject` | Reject button label. |
| `acceptSeverity` | `ButtonSeverity` | — | Accept button semantic color. |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | Status icon beside the message. |
| `loading` | `boolean` | `false` | Loading state on the accept button. |
| `beforeAccept` | `() => unknown \| Promise<unknown>` | — | Return `false` to keep open and skip `accept`. |
| `beforeReject` | `() => unknown \| Promise<unknown>` | — | Return `false` to keep open and skip `reject`. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `accept` | — | Accept clicked. |
| `reject` | — | Reject clicked or dialog closed. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dialog body. |
