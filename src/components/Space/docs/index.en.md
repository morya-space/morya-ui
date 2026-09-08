---
title: Space
category: 01 / BASIC
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { WkSpace } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkSpace } from '@wise-kit/ui'
</script>

<template>
  <WkSpace>
    <WkButton label="Save" size="small" />
    <WkButton label="Cancel" size="small" severity="secondary" />
    <WkButton label="Reset" size="small" severity="secondary" />
  </WkSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WkSpace, WkTag } from '@wise-kit/ui'
</script>

<template>
  <WkSpace vertical>
    <WkTag value="Alpha" />
    <WkTag value="Bravo" />
    <WkTag value="Charlie" />
  </WkSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WkButton, WkSpace } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WkSpace size="small">
      <WkButton label="S" size="small" />
      <WkButton label="S" size="small" severity="secondary" />
    </WkSpace>
    <WkSpace :size="20">
      <WkButton label="20px" size="small" />
      <WkButton label="20px" size="small" severity="secondary" />
    </WkSpace>
  </div>
</template>
```

When `size` is omitted it defaults to `medium`. Override the global gap with `WkConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview
<script setup lang="ts">
import { WkSpace, WkTag } from '@wise-kit/ui'
</script>

<template>
  <WkSpace :wrap-item="false" :size="8">
    <WkTag value="Direct" />
    <WkTag value="Children" />
  </WkSpace>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis alignment. |
| `inline` | `boolean` | `false` | Use `inline-flex`. |
| `vertical` | `boolean` | `false` | Column direction. |
| `reverse` | `boolean` | `false` | Reverse main axis. |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | Gap size. |
| `wrap` | `boolean` | `true` | Allow wrapping. |
| `wrapItem` | `boolean` | `true` | Wrap each child in a container. |
| `itemClass` / `itemStyle` | — | — | Wrapper class / style when `wrapItem` is true. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Spaced children. |
