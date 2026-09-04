---
title: InputGroup
category: 02 / FORM
description: Combine an input with prefix and suffix addons into one control group.
---

# InputGroup

Combine an input with prefix and suffix addons. Use `WdInputGroupAddon` for addons, or add the `wd-inputgroup-addon` class manually.

## Import

```ts
import { WdInput, WdInputGroup, WdInputGroupAddon } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdInput, WdInputGroup, WdInputGroupAddon } from '@wex-design/ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WdInputGroup>
      <WdInputGroupAddon>$</WdInputGroupAddon>
      <WdInput v-model="price" placeholder="Price" fluid />
      <WdInputGroupAddon>.00</WdInputGroupAddon>
    </WdInputGroup>
    <WdInputGroup>
      <WdInputGroupAddon>https://</WdInputGroupAddon>
      <WdInput v-model="url" placeholder="example.com" fluid />
    </WdInputGroup>
  </div>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `default` | Addons and input controls. |

The addon component only provides a default slot; its root element class is `wd-inputgroup-addon`.

## Events

No custom events.
