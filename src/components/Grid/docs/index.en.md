---
title: Grid
category: 05 / PANEL
description: CSS Grid layout with GridItem span / offset control.
---

# Grid

24-column grid layout (override with `cols`). Use `WiGridItem` (alias `WiGi`) as children.

## Import

```ts
import { WiGrid, WiGridItem } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid :cols="4" :x-gap="12" :y-gap="12">
    <WiGridItem v-for="n in 4" :key="n" :span="1">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        {{ n }}
      </div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Span & Offset

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid :cols="6" :x-gap="12" :y-gap="12">
    <WiGridItem :span="2">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">span 2</div>
    </WiGridItem>
    <WiGridItem :span="2" :offset="1">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">offset 1</div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Responsive

`cols` / `xGap` / `yGap` and GridItem `span` / `offset` accept responsive strings such as `1 s:2 m:3` (breakpoints: `xs` `s` `m` `l` `xl` `2xl`).

When `cols` / gaps are plain numbers but items still need responsive `span`, enable `itemResponsive`.

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid cols="2 s:3 m:4" :x-gap="12" :y-gap="12" item-responsive>
    <WiGridItem v-for="n in 4" :key="n" span="1 m:2">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        {{ n }}
      </div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Collapsed

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiGrid, WiGridItem, WiButton } from '@well-insight/ui'

const collapsed = ref(true)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WiButton size="small" :label="collapsed ? 'Expand' : 'Collapse'" @click="collapsed = !collapsed" />
    <WiGrid :cols="4" :x-gap="8" :y-gap="8" :collapsed="collapsed" :collapsed-rows="1">
      <WiGridItem v-for="n in 6" :key="n" :span="1">
        <div style="padding:0.5rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
          {{ n }}
        </div>
      </WiGridItem>
      <WiGridItem suffix :span="1">
        <template #default="{ overflow }">
          <div style="padding:0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
            {{ overflow ? 'More…' : 'All' }}
          </div>
        </template>
      </WiGridItem>
    </WiGrid>
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
