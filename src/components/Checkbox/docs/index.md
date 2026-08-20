---
title: Checkbox
category: 02 / FORM
description: 复选框。二进制 modelValue，支持 invalid。
---

# Checkbox

二进制复选框。 的 binary 用法。

## 引入

```ts
import { WiCheckbox } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiCheckbox } from '@well-insight/ui'

const accepted = ref(false)
</script>

<template>
  <WiCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiCheckbox } from '@well-insight/ui'

const accepted = ref(false)
</script>

<template>
  <WiCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiCheckbox } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WiCheckbox :model-value="true" disabled label="Checked disabled" />
    <WiCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 二进制选中态。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `name` | `string` | — | 原生 name。 |
| `value` | `string` | — | 原生 value。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 原生 required。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 选中态变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义标签，优先于 `label`。 |
