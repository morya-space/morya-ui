---
title: Panel
category: 05 / PANEL
description: Content panel with optional collapse.
---

# Panel

Panel for grouping content. Collapse can be enabled.

## Import

```ts
import { WdPanel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdPanel } from '@well-insight/ui'

const collapsed = ref(false)
</script>

<template>
  <WdPanel v-model="collapsed" header="Panel" toggleable>
    <p style="margin:0">Collapsible panel content.</p>
  </WdPanel>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | — | Header text. |
| `toggleable` | `boolean` | `false` | Whether the panel can collapse. |
| `collapsed` | `boolean` | `false` | Collapsed state. |
| `modelValue` | `boolean` | — | `v-model` alias for `collapsed`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:collapsed` | `boolean` | Emitted when the collapsed state changes. |
| `update:modelValue` | `boolean` | Same as `update:collapsed`. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Panel content. |
| `header` | Custom header. |
