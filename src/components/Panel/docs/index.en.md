---
title: Panel
category: 03 / DATA
description: Content panel with optional collapse.
---

# Panel

Panel for grouping content. Collapse can be enabled.

## Import

```ts
import { WkPanel } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkPanel } from '@wise-kit/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WkPanel v-model="collapsed" header="Panel" toggleable>
    <p style="margin:0">
      Collapsible panel content.
    </p>
    <template #footer>
      Actions
    </template>
  </WkPanel>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WkPanel } from '@wise-kit/ui'
</script>

<template>
  <WkPanel header="Small" size="small">
    <p style="margin:0">
      A more compact panel.
    </p>
  </WkPanel>
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
