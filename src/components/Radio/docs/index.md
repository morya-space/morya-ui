---
title: Radio
category: 02 / FORM
description: 单选框。支持 invalid。
---

# Radio

单选框。

## 引入

```ts
import { WdRadio } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdRadio } from '@well-insight/ui'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio v-model="size" name="size" value="sm" label="Small" />
    <WdRadio v-model="size" name="size" value="md" label="Medium" />
    <WdRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdRadio } from '@well-insight/ui'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <WdRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdRadio } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio model-value="a" value="a" disabled label="Selected" />
    <WdRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | 当前选中值。 |
| `value` | `string \| number \| boolean` | — | **必填**，本选项的值。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `name` | `string` | — | 原生 name（同组需一致）。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 原生 required。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | 选中值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义标签，优先于 `label`。 |
