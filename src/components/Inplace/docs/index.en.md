---
title: Inplace
category: 07 / MISC
description: Click the display area to switch to editable content.
---

# Inplace

Toggle between display and content views.

## Import

```ts
import { WiInplace } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiInplace, WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('Click to edit')
</script>

<template>
  <WiInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <WiInput v-model="text" />
        <WiButton label="Done" size="small" @click="close" />
      </div>
    </template>
  </WiInplace>
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
