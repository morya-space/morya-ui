---
title: InputGroup
category: 02 / FORM
description: Combine an input with prefix and suffix addons into one control group.
---

# InputGroup

Combine an input with prefix and suffix addons. Use `WiInputGroupAddon` for addons, or add the `wi-inputgroup-addon` class manually.

## Import

```ts
import { WiInput, WiInputGroup, WiInputGroupAddon } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiInput, WiInputGroup, WiInputGroupAddon } from '@well-insight/ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiInputGroup>
      <WiInputGroupAddon>$</WiInputGroupAddon>
      <WiInput v-model="price" placeholder="Price" fluid />
      <WiInputGroupAddon>.00</WiInputGroupAddon>
    </WiInputGroup>
    <WiInputGroup>
      <WiInputGroupAddon>https://</WiInputGroupAddon>
      <WiInput v-model="url" placeholder="example.com" fluid />
    </WiInputGroup>
  </div>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `default` | Addons and input controls. |

The addon component only provides a default slot; its root element class is `wi-inputgroup-addon`.
