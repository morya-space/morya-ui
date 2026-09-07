---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { RdIcon, RdIconField, RdInput } from '@roost-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdIcon, RdIconField, RdInput } from '@roost-design/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <RdIconField>
      <template #icon>
        <RdIcon name="info" size="sm" />
      </template>
      <RdInput v-model="value" placeholder="Search" fluid />
    </RdIconField>
    <RdIconField icon-position="right">
      <template #icon>
        <RdIcon name="check" size="sm" />
      </template>
      <RdInput v-model="value" placeholder="Verified" fluid />
    </RdIconField>
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
