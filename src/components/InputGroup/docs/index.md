---
title: InputGroup
category: 02 / FORM
description: 将输入框与前后缀附加内容组合为同一控件组。
---

# InputGroup

组合输入与前后缀。附加内容使用 `MInputGroupAddon`，或手动添加 `m-inputgroup-addon` class。

## 引入

```ts
import { MInput, MInputGroup, MInputGroupAddon } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MInput, MInputGroup, MInputGroupAddon } from 'morya-ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <MInputGroup>
      <MInputGroupAddon>$</MInputGroupAddon>
      <MInput v-model="price" placeholder="Price" fluid />
      <MInputGroupAddon>.00</MInputGroupAddon>
    </MInputGroup>
    <MInputGroup>
      <MInputGroupAddon>https://</MInputGroupAddon>
      <MInput v-model="url" placeholder="example.com" fluid />
    </MInputGroup>
  </div>
</template>
```

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 附加项与输入控件。 |

Addon 组件仅提供默认插槽，根元素 class 为 `m-inputgroup-addon`。

## Events

无自定义事件。
