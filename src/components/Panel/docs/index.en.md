---
title: Panel
category: 05 / PANEL
description: Content panel with optional collapse.
---

# Panel

Panel for grouping content. Collapse can be enabled.

## Import

```ts
import { WiPanel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiPanel } from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WiPanel v-model="collapsed" header="Panel" toggleable>
    <p style="margin:0">
      Collapsible panel content.
    </p>
    <template #footer>
      Actions
    </template>
  </WiPanel>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiPanel } from '@well-insight/ui'
</script>

<template>
  <WiPanel header="Small" size="small">
    <p style="margin:0">
      A more compact panel.
    </p>
  </WiPanel>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | — | Header text. |
| `toggleable` | `boolean` | `false` | Whether the panel can collapse. |
| `collapsed` | `boolean` | `false` | Collapsed state. |
| `modelValue` | `boolean` | — | `v-model` alias for `collapsed`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |

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
| `footer` | Footer; hidden when collapsed. |
