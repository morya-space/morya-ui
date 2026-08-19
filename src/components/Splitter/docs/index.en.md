---
title: Splitter
category: 05 / PANEL
description: Two-pane split layout with horizontal / vertical orientation and drag-to-resize.
---

# Splitter

Split content into two panes side by side or stacked, and drag the gutter to resize.

## Import

```ts
import { WdSplitter } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdSplitter } from '@well-insight/ui'
</script>

<template>
  <WdSplitter style="min-height: 8rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">Panel A — drag the divider</div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">Panel B</div>
    </template>
  </WdSplitter>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WdSplitter } from '@well-insight/ui'
</script>

<template>
  <WdSplitter layout="vertical" style="min-height: 10rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">Top</div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">Bottom</div>
    </template>
  </WdSplitter>
</template>
```

## Controlled size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSplitter } from '@well-insight/ui'

const size = ref(35)
</script>

<template>
  <div style="display:grid;gap:0.5rem">
    <p style="margin:0;color:var(--wd-color-text-muted);font-size:0.75rem">Left {{ size }}%</p>
    <WdSplitter
      v-model:size="size"
      style="min-height: 8rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding: 0.75rem">{{ size }}%</div>
      </template>
      <template #panel2>
        <div style="padding: 0.75rem">{{ 100 - size }}%</div>
      </template>
    </WdSplitter>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction. |
| `size` | `number` | `50` | Primary pane (left/top) size in `%`; supports `v-model:size`. |
| `min` / `max` | `number` | `10` / `90` | Min/max for the primary pane size. |

## Slots

| Slot | Description |
| --- | --- |
| `panel1` | Left / top pane. |
| `panel2` | Right / bottom pane. |
| `default` | Uses the first two child nodes when named slots are not used. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:size` | `number` | After resize by drag or keyboard. |
| `resize` | `number` | Same as `update:size`, for listening. |
