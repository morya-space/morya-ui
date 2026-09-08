---
title: Inplace
category: 03 / DATA
description: Click the display area to switch to editable content.
---

# Inplace

Toggle between display and content views.

## Import

```ts
import { WkInplace } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkInplace, WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('Click to edit')
</script>

<template>
  <WkInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <WkInput v-model="text" />
        <WkButton label="Done" size="small" @click="close" />
      </div>
    </template>
  </WkInplace>
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
