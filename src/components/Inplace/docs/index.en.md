---
title: Inplace
category: 07 / MISC
description: Click the display area to switch to editable content.
---

# Inplace

Toggle between display and content views.

## Import

```ts
import { WdInplace } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInplace, WdInput, WdButton } from '@well-insight/ui'

const active = ref(false)
const text = ref('Click to edit')
</script>

<template>
  <WdInplace v-model="active">
    <template #display>{{ text }}</template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <WdInput v-model="text" />
        <WdButton label="Done" size="small" @click="close" />
      </div>
    </template>
  </WdInplace>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the editor is active. |
| `disabled` | `boolean` | `false` | Disable toggling. |

## Slots

| Slot | Description |
| --- | --- |
| `display` | Default display. |
| `content` | Active content; provides `{ close }`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Active state changed. |
