---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { MIcon, MIconField, MInput } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MIcon, MIconField, MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MIconField>
      <template #icon>
        <MIcon name="info" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Search" fluid />
    </MIconField>
    <MIconField icon-position="right">
      <template #icon>
        <MIcon name="check" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Verified" fluid />
    </MIconField>
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
