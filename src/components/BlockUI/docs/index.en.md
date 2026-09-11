---
title: BlockUI
category: 05 / FEEDBACK
description: Overlays content with a mask to block interaction.
---

# BlockUI

Wraps content and shows a mask when `blocked` is true.

## Import

```ts
import { MBlockUI } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MBlockUI, MButton } from 'morya-ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <MButton :label="blocked ? 'Unblock' : 'Block'" @click="blocked = !blocked" />
  <MBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>Panel content</p>
  </MBlockUI>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | Whether the overlay is active. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
