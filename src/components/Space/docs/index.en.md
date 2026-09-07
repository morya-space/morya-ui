---
title: Space
category: 01 / BASIC
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { RdSpace } from '@roost-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdButton, RdSpace } from '@roost-design/ui'
</script>

<template>
  <RdSpace>
    <RdButton label="Save" size="small" />
    <RdButton label="Cancel" size="small" severity="secondary" />
    <RdButton label="Reset" size="small" severity="secondary" />
  </RdSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { RdSpace, RdTag } from '@roost-design/ui'
</script>

<template>
  <RdSpace vertical>
    <RdTag value="Alpha" />
    <RdTag value="Bravo" />
    <RdTag value="Charlie" />
  </RdSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { RdButton, RdSpace } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <RdSpace size="small">
      <RdButton label="S" size="small" />
      <RdButton label="S" size="small" severity="secondary" />
    </RdSpace>
    <RdSpace :size="20">
      <RdButton label="20px" size="small" />
      <RdButton label="20px" size="small" severity="secondary" />
    </RdSpace>
  </div>
</template>
```

When `size` is omitted it defaults to `medium`. Override the global gap with `RdConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview
<script setup lang="ts">
import { RdSpace, RdTag } from '@roost-design/ui'
</script>

<template>
  <RdSpace :wrap-item="false" :size="8">
    <RdTag value="Direct" />
    <RdTag value="Children" />
  </RdSpace>
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
