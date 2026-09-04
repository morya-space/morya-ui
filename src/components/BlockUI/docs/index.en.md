---
title: BlockUI
category: 05 / FEEDBACK
description: Overlays content with a mask to block interaction.
---

# BlockUI

Wraps content and shows a mask when `blocked` is true.

## Import

```ts
import { WdBlockUI } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdBlockUI, WdButton } from '@wex-design/ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <WdButton :label="blocked ? 'Unblock' : 'Block'" @click="blocked = !blocked" />
  <WdBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>Panel content</p>
  </WdBlockUI>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | Whether the overlay is active. |

## Events

No custom events.

## Slots

No slots.
