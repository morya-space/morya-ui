---
title: InputGroup
category: 02 / FORM
description: 将输入框与前后缀附加内容组合为同一控件组。
---

# InputGroup

组合输入与前后缀。附加内容使用 `WdInputGroupAddon`，或手动添加 `wd-inputgroup-addon` class。

## 引入

```ts
import { WdInput, WdInputGroup, WdInputGroupAddon } from '@wex-design/ui'
```

## 基础用法

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

| 名称 | 说明 |
| --- | --- |
| `default` | 附加项与输入控件。 |

Addon 组件仅提供默认插槽，根元素 class 为 `wd-inputgroup-addon`。

## Events

无自定义事件。
