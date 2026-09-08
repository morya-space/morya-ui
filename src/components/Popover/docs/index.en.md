---
title: Popover
category: 05 / FEEDBACK
description: Floating panel positioned relative to a trigger. Supports placement and Teleport. Closes on outside click or Esc.
---

# Popover

Overlay positioned relative to a trigger. Use it for filters, quick actions, or lightweight forms.

## Import

```ts
import { WkButton, WkPopover } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkPopover } from '@wise-kit/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <WkPopover v-model="open" placement="bottom">
    <WkButton label="Toggle Popover" @click="open = !open" />
    <template #content>
      <p style="margin:0">
        Click outside or press Esc to close.
      </p>
    </template>
  </WkPopover>
</template>
```

## Placement

```vue preview
<script setup lang="ts">
import { WkButton, WkPopover } from '@wise-kit/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div style="display:flex;justify-content:center;padding:2rem">
    <WkPopover v-model="open" placement="bottom-start">
      <WkButton label="bottom-start" severity="secondary" @click="open = !open" />
      <template #content>
        <p style="margin:0">
          Aligned to the start of the trigger.
        </p>
      </template>
    </WkPopover>
  </div>
</template>
```

## Hover

`trigger` defaults to `manual` (`v-model` only). Use `hover` / `click` / `focus` to let the component open itself.

```vue preview
<script setup lang="ts">
import { WkButton, WkPopover } from '@wise-kit/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <WkPopover v-model="open" trigger="hover" :show-delay="80" :hide-delay="120">
    <WkButton label="Hover me" severity="secondary" />
    <template #content>
      <p style="margin:0">
        Opens on hover.
      </p>
    </template>
  </WkPopover>
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
