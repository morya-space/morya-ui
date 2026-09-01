---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { WiIcon, WiIconField, WiInput } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiIcon, WiIconField, WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiIconField>
      <template #icon>
        <WiIcon name="info" size="sm" />
      </template>
      <WiInput v-model="value" placeholder="Search" fluid />
    </WiIconField>
    <WiIconField icon-position="right">
      <template #icon>
        <WiIcon name="check" size="sm" />
      </template>
      <WiInput v-model="value" placeholder="Verified" fluid />
    </WiIconField>
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

## Events

No custom events.
