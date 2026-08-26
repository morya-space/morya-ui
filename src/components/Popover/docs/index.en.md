---
title: Popover
category: 04 / OVERLAY
description: Floating panel positioned relative to a trigger. Supports placement and Teleport. Closes on outside click or Esc.
---

# Popover

Overlay positioned relative to a trigger. Use it for filters, quick actions, or lightweight forms.

## Import

```ts
import { WiPopover, WiButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiPopover } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <WiPopover v-model="open" placement="bottom">
    <WiButton label="Toggle Popover" @click="open = !open" />
    <template #content>
      <p style="margin:0">Click outside or press Esc to close.</p>
    </template>
  </WiPopover>
</template>
```

## Placement

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiPopover } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div style="display:flex;justify-content:center;padding:2rem">
    <WiPopover v-model="open" placement="bottom-start">
      <WiButton label="bottom-start" severity="secondary" @click="open = !open" />
      <template #content>
        <p style="margin:0">Aligned to the start of the trigger.</p>
      </template>
    </WiPopover>
  </div>
</template>
```

## Hover

`trigger` defaults to `manual` (`v-model` only). Use `hover` / `click` / `focus` to let the component open itself.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiPopover } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <WiPopover v-model="open" trigger="hover" :show-delay="80" :hide-delay="120">
    <WiButton label="Hover me" severity="secondary" />
    <template #content>
      <p style="margin:0">Opens on hover.</p>
    </template>
  </WiPopover>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model`. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` | Position relative to the trigger. |
| `trigger` | `'manual' \| 'click' \| 'hover' \| 'focus'` | `'manual'` | How it opens. |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | Hover/focus delay in ms. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when visibility changes. |
| `show` | — | Emitted when opened. |
| `hide` | — | Emitted after close. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Trigger element. |
| `content` | Overlay content. |
