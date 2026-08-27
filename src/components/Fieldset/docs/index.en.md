---
title: Fieldset
category: 05 / PANEL
description: Grouped fields with a legend, optionally collapsible.
---

# Fieldset

Group a form or related content with a legend.

## Import

```ts
import { WiFieldset } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiFieldset } from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WiFieldset legend="Account" toggleable :collapsed="collapsed" @update:collapsed="collapsed = $event">
    <p style="margin:0">
      Field group content.
    </p>
  </WiFieldset>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | `string` | — | Legend text. |
| `toggleable` | `boolean` | `false` | Whether the fieldset can be collapsed. |
| `collapsed` | `boolean` | `false` | Whether it is collapsed. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:collapsed` | `boolean` | Collapsed state change. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content. |
| `legend` | Custom legend. |
