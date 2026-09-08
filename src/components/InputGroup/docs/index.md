---
title: InputGroup
category: 02 / FORM
description: 将输入框与前后缀附加内容组合为同一控件组。
---

# InputGroup

组合输入与前后缀。附加内容使用 `RdInputGroupAddon`，或手动添加 `rd-inputgroup-addon` class。

## 引入

```ts
import { RdInput, RdInputGroup, RdInputGroupAddon } from '@wise-kit/ui'
```

## 基础用法

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

| 名称 | 说明 |
| --- | --- |
| `default` | 附加项与输入控件。 |

Addon 组件仅提供默认插槽，根元素 class 为 `rd-inputgroup-addon`。

## Events

无自定义事件。
