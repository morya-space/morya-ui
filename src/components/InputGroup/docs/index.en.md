---
title: InputGroup
category: 02 / FORM
description: Combine an input with prefix and suffix addons into one control group.
---

# InputGroup

Combine an input with prefix and suffix addons. Use `RdInputGroupAddon` for addons, or add the `rd-inputgroup-addon` class manually.

## Import

```ts
import { RdInput, RdInputGroup, RdInputGroupAddon } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdInput, RdInputGroup, RdInputGroupAddon } from '@wise-kit/ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <RdInputGroup>
      <RdInputGroupAddon>$</RdInputGroupAddon>
      <RdInput v-model="price" placeholder="Price" fluid />
      <RdInputGroupAddon>.00</RdInputGroupAddon>
    </RdInputGroup>
    <RdInputGroup>
      <RdInputGroupAddon>https://</RdInputGroupAddon>
      <RdInput v-model="url" placeholder="example.com" fluid />
    </RdInputGroup>
  </div>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `default` | Addons and input controls. |

The addon component only provides a default slot; its root element class is `rd-inputgroup-addon`.

## Events

No custom events.
