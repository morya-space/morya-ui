---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { WkIcon, WkIconField, WkInput } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkIcon, WkIconField, WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WkIconField>
      <template #icon>
        <WkIcon name="info" size="sm" />
      </template>
      <WkInput v-model="value" placeholder="Search" fluid />
    </WkIconField>
    <WkIconField icon-position="right">
      <template #icon>
        <WkIcon name="check" size="sm" />
      </template>
      <WkInput v-model="value" placeholder="Verified" fluid />
    </WkIconField>
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
