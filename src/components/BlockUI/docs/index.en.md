---
title: BlockUI
category: 07 / MISC
description: Overlays content with a mask to block interaction.
---

# BlockUI

Wraps content and shows a mask when `blocked` is true.

## Import

```ts
import { WiBlockUI } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiBlockUI, WiButton } from '@well-insight/ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <WiButton :label="blocked ? 'Unblock' : 'Block'" @click="blocked = !blocked" />
  <WiBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>Panel content</p>
  </WiBlockUI>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | Whether the overlay is active. |
