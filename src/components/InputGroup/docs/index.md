---
title: InputGroup
category: 02 / FORM
description: 将输入框与前后缀附加内容组合为同一控件组。
---

# InputGroup

组合输入与前后缀。附加内容使用 `WiInputGroupAddon`，或手动添加 `wi-inputgroup-addon` class。

## 引入

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

| 名称 | 说明 |
| --- | --- |
| `default` | 附加项与输入控件。 |

Addon 组件仅提供默认插槽，根元素 class 为 `wi-inputgroup-addon`。
