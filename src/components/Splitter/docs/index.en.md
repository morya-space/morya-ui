---
title: Splitter
category: 05 / PANEL
description: Two-pane resizable split layout (horizontal / vertical).
---

# Splitter

Split content into two panes with a draggable gutter. Covers common Naive `n-split` capabilities while keeping Wi percent sizing.

## Import

```ts
import { WiSplitter } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter style="min-height: 8rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Panel A — drag the gutter
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Panel B
      </div>
    </template>
  </WiSplitter>
</template>
```

## Vertical / direction

`layout` and Naive-style `direction` are equivalent.

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter direction="vertical" style="min-height: 10rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Top
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Bottom
      </div>
    </template>
  </WiSplitter>
</template>
```

## Size modes

- `number > 1`: percent (Wi default, e.g. `35` → 35%)
- `number ≤ 1`: ratio (Naive, e.g. `0.35` → 35%)
- `string`: pixels (e.g. `'120px'`)

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
import { ref } from 'vue'

const percent = ref(40)
const ratio = ref(0.3)
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiSplitter
      v-model:size="percent"
      style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          {{ percent }}%
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </WiSplitter>
    <WiSplitter
      v-model:size="ratio"
      :min="0.15"
      :max="0.85"
      style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          ratio {{ ratio }}
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </WiSplitter>
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter disabled :size="40" style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding:0.75rem">
        Not draggable
      </div>
    </template>
    <template #panel2>
      <div style="padding:0.75rem">
        B
      </div>
    </template>
  </WiSplitter>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction. |
| `direction` | same | — | Alias of `layout` (Naive). |
| `size` | `number \| string` | — | Controlled size; `>1` = `%`, `≤1` = ratio, `'Npx'` = pixels. |
| `defaultSize` | `number \| string` | `50` | Uncontrolled initial size. |
| `min` / `max` | `number \| string` | mode-based | Bounds (same unit family as `size`). |
| `disabled` | `boolean` | `false` | Disable drag and keyboard resize. |
| `resizeTriggerSize` | `number` | `6` | Gutter thickness in px. |
| `pane1Class` / `pane1Style` | — | — | Primary pane class / style. |
| `pane2Class` / `pane2Style` | — | — | Secondary pane class / style. |

## Slots

| Slot | Description |
| --- | --- |
| `panel1` / `1` | Left / top pane. |
| `panel2` / `2` | Right / bottom pane. |
| `resize-trigger` | Custom gutter content. |
| `default` | First two children when named slots are unused. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:size` | `number \| string` | Size changed. |
| `resize` | same | Convenience listener. |
| `drag-start` / `drag-move` / `drag-end` | `Event` | Drag lifecycle. |
