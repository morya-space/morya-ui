---
title: Panel
category: 03 / DATA
description: Content panel with optional collapse.
---

# Panel

Panel for grouping content. Collapse can be enabled.

## Import

```ts
import { WdPanel } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdPanel } from '@wex-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WdPanel v-model="collapsed" header="Panel" toggleable>
    <p style="margin:0">
      Collapsible panel content.
    </p>
    <template #footer>
      Actions
    </template>
  </WdPanel>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WdPanel } from '@wex-design/ui'
</script>

<template>
  <WdPanel header="Small" size="small">
    <p style="margin:0">
      A more compact panel.
    </p>
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
