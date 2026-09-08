---
title: Radio
category: 02 / FORM
description: 单选框。支持 invalid。
---

# Radio

单选框。

## 引入

```ts
import { WkRadio } from '@wise-kit/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio v-model="size" name="size" value="sm" label="Small" />
    <WkRadio v-model="size" name="size" value="md" label="Medium" />
    <WkRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <WkRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio model-value="a" value="a" disabled label="Selected" />
    <WkRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Group

```vue preview
<script setup lang="ts">
import { WkRadio, WkRadioGroup } from '@wise-kit/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <WkRadioGroup v-model="size">
    <WkRadio value="sm" label="Small" />
    <WkRadio value="md" label="Medium" />
    <WkRadio value="lg" label="Large" />
  </WkRadioGroup>
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
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
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
