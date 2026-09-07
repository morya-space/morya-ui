---
title: Grid
category: 06 / LAYOUT
description: CSS Grid layout with GridItem span / offset control.
---

# Grid

24-column grid layout (override with `cols`). Use `RdGridItem` (alias `RdGi`) as children.

## Import

```ts
import { RdGrid, RdGridItem } from '@roost-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdGrid, RdGridItem } from '@roost-design/ui'
</script>

<template>
  <RdGrid :cols="4" :x-gap="12" :y-gap="12">
    <RdGridItem v-for="n in 4" :key="n" :span="1">
      <div style="padding:0.75rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
        {{ n }}
      </div>
    </RdGridItem>
  </RdGrid>
</template>
```

## Span & Offset

```vue preview
<script setup lang="ts">
import { RdGrid, RdGridItem } from '@roost-design/ui'
</script>

<template>
  <RdGrid :cols="6" :x-gap="12" :y-gap="12">
    <RdGridItem :span="2">
      <div style="padding:0.75rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
        span 2
      </div>
    </RdGridItem>
    <RdGridItem :span="2" :offset="1">
      <div style="padding:0.75rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
        offset 1
      </div>
    </RdGridItem>
  </RdGrid>
</template>
```

## Responsive

`cols` / `xGap` / `yGap` and GridItem `span` / `offset` accept responsive strings such as `1 s:2 m:3` (breakpoints: `xs` `s` `m` `l` `xl` `2xl`).

When `cols` / gaps are plain numbers but items still need responsive `span`, enable `itemResponsive`.

```vue preview
<script setup lang="ts">
import { RdGrid, RdGridItem } from '@roost-design/ui'
</script>

<template>
  <RdGrid cols="2 s:3 m:4" :x-gap="12" :y-gap="12" item-responsive>
    <RdGridItem v-for="n in 4" :key="n" span="1 m:2">
      <div style="padding:0.75rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
        {{ n }}
      </div>
    </RdGridItem>
  </RdGrid>
</template>
```

## Collapsed

```vue preview
<script setup lang="ts">
import { RdButton, RdGrid, RdGridItem } from '@roost-design/ui'
import { ref } from 'vue'

const collapsed = ref(true)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <RdButton size="small" :label="collapsed ? 'Expand' : 'Collapse'" @click="collapsed = !collapsed" />
    <RdGrid :cols="4" :x-gap="8" :y-gap="8" :collapsed="collapsed" :collapsed-rows="1">
      <RdGridItem v-for="n in 6" :key="n" :span="1">
        <div style="padding:0.5rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
          {{ n }}
        </div>
      </RdGridItem>
      <RdGridItem suffix :span="1">
        <template #default="{ overflow }">
          <div style="padding:0.5rem;color:var(--rd-color-text-muted);font-size:0.75rem">
            {{ overflow ? 'More…' : 'All' }}
          </div>
        </template>
      </RdGridItem>
    </RdGrid>
  </div>
</template>
```

## Grid Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | Columns; supports `"1 s:2 m:3"` responsive syntax. |
| `xGap` / `yGap` | `number \| string` | `0` | Column / row gap in px (responsive strings allowed). |
| `responsive` | `'self' \| 'screen'` | `'self'` | Use container width or viewport width. |
| `itemResponsive` | `boolean` | `false` | Force width queries for item `span` / `offset` even when `cols` is numeric. |
| `collapsed` | `boolean` | `false` | Hide items beyond visible rows. |
| `collapsedRows` | `number` | `1` | Visible rows when collapsed. |
| `layoutShiftDisabled` | `boolean` | `false` | Plain CSS Grid without collapse bookkeeping. |
| `itemStyle` | `string \| object` | — | Style applied to every GridItem. |

## GridItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `span` | `number \| string` | `1` | Column span. |
| `offset` | `number \| string` | `0` | Leading offset columns. |
| `suffix` | `boolean` | `false` | Pin to the end when collapsed. |

## GridItem Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ overflow }` | Content; `overflow` is true when items are hidden. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Grid children. |
