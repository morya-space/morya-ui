---
title: Radio
category: 02 / FORM
description: 单选框。支持 invalid。
---

# Radio

单选框。

## 引入

```ts
import { WiRadio } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiRadio } from '@well-insight/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WiRadio v-model="size" name="size" value="sm" label="Small" />
    <WiRadio v-model="size" name="size" value="md" label="Medium" />
    <WiRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WiRadio } from '@well-insight/ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WiRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <WiRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiRadio } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WiRadio model-value="a" value="a" disabled label="Selected" />
    <WiRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Group

```vue preview
<script setup lang="ts">
import { WiRadio, WiRadioGroup } from '@well-insight/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <WiRadioGroup v-model="size">
    <WiRadio value="sm" label="Small" />
    <WiRadio value="md" label="Medium" />
    <WiRadio value="lg" label="Large" />
  </WiRadioGroup>
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
