---
title: Tabs
category: 05 / PANEL
description: Tab switcher with line/card types, closable/addable tabs, extra slot, and overflow scrolling.
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

## Card / closable / extra

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiTabs } from '@well-insight/ui'

const active = ref('a')
const tabs = ref([
  { label: 'Design', value: 'a' },
  { label: 'Data', value: 'b' },
  { label: 'Ship', value: 'c' },
])

function onClose(value: string) {
  tabs.value = tabs.value.filter((tab) => tab.value !== value)
}

function onAdd() {
  const value = `tab-${tabs.value.length + 1}`
  tabs.value = [...tabs.value, { label: `Tab ${tabs.value.length + 1}`, value }]
  active.value = value
}
</script>

<template>
  <WiTabs
    v-model="active"
    type="card"
    closable
    addable
    :tabs="tabs"
    @close="onClose"
    @add="onAdd"
  >
    <template #extra>
      <WiButton label="Action" size="small" severity="secondary" />
    </template>
    <template #default="{ activeValue }">
      <p style="margin:0">{{ activeValue }}</p>
    </template>
  </WiTabs>
</template>
```

When tabs overflow the container, scroll buttons appear at both ends.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | Currently active tab. |
| `tabs` | `TabItem[]` | — | Tab list; supports `disabled` / `closable`. |
| `type` | `'line' \| 'card'` | `'line'` | Appearance. |
| `closable` | `boolean` | `false` | Show close buttons; per-item `closable` wins. |
| `addable` | `boolean` | `false` | Show an add button. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the active item changes. |
| `change` | `string` | Emitted after the switch completes. |
| `close` | `string` | Emitted when a close button is clicked. |
| `add` | — | Emitted when the add button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Panel content; scoped slot `{ activeValue }`. |
| `extra` | Extra content on the right of the tab bar. |
