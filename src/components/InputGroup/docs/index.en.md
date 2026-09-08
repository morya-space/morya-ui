---
title: InputGroup
category: 02 / FORM
description: Combine an input with prefix and suffix addons into one control group.
---

# InputGroup

Combine an input with prefix and suffix addons. Use `WkInputGroupAddon` for addons, or add the `wk-inputgroup-addon` class manually.

## Import

```ts
import { WkInput, WkInputGroup, WkInputGroupAddon } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkInput, WkInputGroup, WkInputGroupAddon } from '@wise-kit/ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WkInputGroup>
      <WkInputGroupAddon>$</WkInputGroupAddon>
      <WkInput v-model="price" placeholder="Price" fluid />
      <WkInputGroupAddon>.00</WkInputGroupAddon>
    </WkInputGroup>
    <WkInputGroup>
      <WkInputGroupAddon>https://</WkInputGroupAddon>
      <WkInput v-model="url" placeholder="example.com" fluid />
    </WkInputGroup>
  </div>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `default` | Addons and input controls. |

The addon component only provides a default slot; its root element class is `wk-inputgroup-addon`.

## Events

No custom events.
