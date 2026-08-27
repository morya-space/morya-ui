---
title: Space
category: 05 / PANEL
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { WiSpace } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
</script>

<template>
  <WiSpace>
    <WiButton label="Save" size="small" />
    <WiButton label="Cancel" size="small" severity="secondary" />
    <WiButton label="Reset" size="small" severity="secondary" />
  </WiSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WiSpace, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiSpace vertical>
    <WiTag value="Alpha" />
    <WiTag value="Bravo" />
    <WiTag value="Charlie" />
  </WiSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiSpace size="small">
      <WiButton label="S" size="small" />
      <WiButton label="S" size="small" severity="secondary" />
    </WiSpace>
    <WiSpace :size="20">
      <WiButton label="20px" size="small" />
      <WiButton label="20px" size="small" severity="secondary" />
    </WiSpace>
  </div>
</template>
```

When `size` is omitted it defaults to `medium`. Override the global gap with `WiConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview
<script setup lang="ts">
import { WiSpace, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiSpace :wrap-item="false" :size="8">
    <WiTag value="Direct" />
    <WiTag value="Children" />
  </WiSpace>
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
