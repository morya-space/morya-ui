---
title: BlockUI
category: 07 / MISC
description: Overlays content with a mask to block interaction.
---

# BlockUI

Wraps content and shows a mask when `blocked` is true.

## Import

```ts
import { WdBlockUI } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdBlockUI, WdButton } from '@well-insight/ui'

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
