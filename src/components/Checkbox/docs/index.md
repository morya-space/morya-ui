---
title: Checkbox
category: 02 / FORM
description: 复选框。二进制 modelValue，支持 invalid。
---

# Checkbox

二进制复选框。 的 binary 用法。

## 引入

```ts
import { WkCheckbox } from '@wise-kit/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WkCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WkCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WkCheckbox :model-value="true" disabled label="Checked disabled" />
    <WkCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Group

`WkCheckboxGroup` 以数组为 `v-model`，子项用 `value` 标识。`indeterminate` 表示部分选中。

```vue preview
<script setup lang="ts">
import { WkCheckbox, WkCheckboxGroup } from '@wise-kit/ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <WkCheckboxGroup v-model="selected">
    <WkCheckbox value="vue" label="Vue" />
    <WkCheckbox value="react" label="React" />
    <WkCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </WkCheckboxGroup>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 二进制选中态。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `name` | `string` | — | 原生 name。 |
| `value` | `string \| number \| boolean` | — | 组内选项值。 |
| `indeterminate` | `boolean` | `false` | 部分选中。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
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
