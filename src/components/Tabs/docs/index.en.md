---
title: Tabs
category: 05 / PANEL
description: Tab switcher. Control the active item with modelValue and a tabs list.
---

# Tabs

Tabs switch content panels within the same view.

## Import

```ts
import { WiTabs } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTabs } from '@well-insight/ui'

const active = ref('design')
const tabs = [
  { label: 'Design', value: 'design' },
  { label: 'Code', value: 'code' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <WiTabs v-model="active" :tabs="tabs">
    <template #default="{ activeValue }">
      <p style="margin:0">Active panel: {{ activeValue }}</p>
    </template>
  </WiTabs>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | Currently active tab. |
| `tabs` | `TabItem[]` | — | Tab list; supports `disabled`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the active item changes. |
| `change` | `string` | Emitted after the switch completes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Panel content; scoped slot `{ activeValue }`. |
