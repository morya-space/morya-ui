---
title: Space
category: 01 / BASIC
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { MSpace } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <MSpace>
    <MButton label="Save" size="small" />
    <MButton label="Cancel" size="small" severity="secondary" />
    <MButton label="Reset" size="small" severity="secondary" />
  </MSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { MSpace, MTag } from 'morya-ui'
</script>

<template>
  <MSpace vertical>
    <MTag value="Alpha" />
    <MTag value="Bravo" />
    <MTag value="Charlie" />
  </MSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <MSpace size="small">
      <MButton label="S" size="small" />
      <MButton label="S" size="small" severity="secondary" />
    </MSpace>
    <MSpace :size="20">
      <MButton label="20px" size="small" />
      <MButton label="20px" size="small" severity="secondary" />
    </MSpace>
  </div>
</template>
```

When `size` is omitted it defaults to `medium`. Override the global gap with `MConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview
<script setup lang="ts">
import { MSpace, MTag } from 'morya-ui'
</script>

<template>
  <MSpace :wrap-item="false" :size="8">
    <MTag value="Direct" />
    <MTag value="Children" />
  </MSpace>
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
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Spaced children. |
