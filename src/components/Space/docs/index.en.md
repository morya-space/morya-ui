---
title: Space
category: 01 / BASIC
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { WdSpace } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdSpace } from '@wex-design/ui'
</script>

<template>
  <WdSpace>
    <WdButton label="Save" size="small" />
    <WdButton label="Cancel" size="small" severity="secondary" />
    <WdButton label="Reset" size="small" severity="secondary" />
  </WdSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WdSpace, WdTag } from '@wex-design/ui'
</script>

<template>
  <WdSpace vertical>
    <WdTag value="Alpha" />
    <WdTag value="Bravo" />
    <WdTag value="Charlie" />
  </WdSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WdButton, WdSpace } from '@wex-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WdSpace size="small">
      <WdButton label="S" size="small" />
      <WdButton label="S" size="small" severity="secondary" />
    </WdSpace>
    <WdSpace :size="20">
      <WdButton label="20px" size="small" />
      <WdButton label="20px" size="small" severity="secondary" />
    </WdSpace>
  </div>
</template>
```

When `size` is omitted it defaults to `medium`. Override the global gap with `WdConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview
<script setup lang="ts">
import { WdSpace, WdTag } from '@wex-design/ui'
</script>

<template>
  <WdSpace :wrap-item="false" :size="8">
    <WdTag value="Direct" />
    <WdTag value="Children" />
  </WdSpace>
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
