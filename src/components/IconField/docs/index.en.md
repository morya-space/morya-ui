---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { WdIconField, WdInput, WdIcon } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdIconField, WdInput, WdIcon } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WdIconField>
      <template #icon><WdIcon name="info" size="sm" /></template>
      <WdInput v-model="value" placeholder="Search" fluid />
    </WdIconField>
    <WdIconField icon-position="right">
      <template #icon><WdIcon name="check" size="sm" /></template>
      <WdInput v-model="value" placeholder="Verified" fluid />
    </WdIconField>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Input control. |
| `icon` | Icon content. |
