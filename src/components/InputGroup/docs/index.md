---
title: InputGroup
category: 02 / FORM
description: 将输入框与前后缀附加内容组合为同一控件组。
---

# InputGroup

组合输入与前后缀。附加内容使用 `WkInputGroupAddon`，或手动添加 `wk-inputgroup-addon` class。

## 引入

```ts
import { WkInput, WkInputGroup, WkInputGroupAddon } from '@wise-kit/ui'
```

## 基础用法

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

| 名称 | 说明 |
| --- | --- |
| `default` | 附加项与输入控件。 |

Addon 组件仅提供默认插槽，根元素 class 为 `wk-inputgroup-addon`。

## Events

无自定义事件。
