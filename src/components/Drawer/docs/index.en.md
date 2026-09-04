---
title: Drawer
category: 05 / FEEDBACK
description: Side drawer panel.
---

# Drawer

Side drawer that slides in from the screen edge. Suited to navigation, filters, or detail panels.

## Import

```ts
import { WdButton, WdDrawer } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdDrawer } from '@wex-design/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WdButton label="Open Drawer" @click="open = true" />
    <WdDrawer v-model="open" header="Navigation">
      <p style="margin:0">
        Drawer body content. Esc or mask click closes by default.
      </p>
    </WdDrawer>
  </div>
</template>
```

## Position

Supports `left` / `right` / `top` / `bottom`.

```vue preview
<script setup lang="ts">
import { WdButton, WdDrawer } from '@wex-design/ui'
import { ref } from 'vue'

const open = ref(false)
const position = ref<'left' | 'right' | 'top' | 'bottom'>('right')

function openAt(next: 'left' | 'right' | 'top' | 'bottom') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WdButton label="Left" size="small" @click="openAt('left')" />
    <WdButton label="Right" size="small" severity="secondary" @click="openAt('right')" />
    <WdButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <WdButton label="Bottom" size="small" severity="secondary" @click="openAt('bottom')" />
    <WdDrawer v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">
        Use <code>dismissable</code> to control mask dismiss.
      </p>
    </WdDrawer>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model`. |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Edge the drawer appears from. |
| `modal` | `boolean` | `true` | Show the overlay mask. |
| `dismissable` | `boolean` | `true` | Close when clicking the mask. |
| `showCloseIcon` | `boolean` | `true` | Show the close button. |
| `header` | `string` | — | Header text. |
| `width` | `number \| string` | — | Width for left/right drawers (`number` = px). |
| `height` | `number \| string` | — | Height for top/bottom drawers (`number` = px). |
| `blockScroll` | `boolean` | `true` | Lock `body` scroll while open. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `show` | — | Emitted when opening. |
| `hide` | — | Emitted after closing. |
| `after-leave` | — | Emitted when the leave animation finishes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Drawer content. |
| `header` | Custom header area. |
