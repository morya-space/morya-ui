---
title: Inplace
category: 03 / DATA
description: Click the display area to switch to editable content.
---

# Inplace

Toggle between display and content views.

## Import

```ts
import { MInplace } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MButton, MInplace, MInput } from 'morya-ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('Click to edit')
</script>

<template>
  <MInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <MInput v-model="text" />
        <MButton label="Done" size="small" @click="close" />
      </div>
    </template>
  </MInplace>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the editor is active. |
| `disabled` | `boolean` | `false` | Disable toggling. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `display` | Default display. |
| `content` | Active content; provides `{ close }`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Active state changed. |
