---
title: Checkbox
category: 02 / FORM
description: 复选框。二进制 modelValue，支持 invalid。
---

# Checkbox

二进制复选框。 的 binary 用法。

## 引入

```ts
import { WdCheckbox } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdCheckbox } from '@wex-design/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WdCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WdCheckbox } from '@wex-design/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WdCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdCheckbox } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WdCheckbox :model-value="true" disabled label="Checked disabled" />
    <WdCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Group

`WdCheckboxGroup` 以数组为 `v-model`，子项用 `value` 标识。`indeterminate` 表示部分选中。

```vue preview
<script setup lang="ts">
import { WdCheckbox, WdCheckboxGroup } from '@wex-design/ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <WdCheckboxGroup v-model="selected">
    <WdCheckbox value="vue" label="Vue" />
    <WdCheckbox value="react" label="React" />
    <WdCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </WdCheckboxGroup>
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
