---
title: Textarea
category: 02 / FORM
description: 多行文本输入。
---

# Textarea

多行文本输入。

## 引入

```ts
import { WiTextarea } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTextarea } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WiTextarea v-model="value" label="Notes" placeholder="Write something…" />
</template>
```

## Size & Variant

```vue preview
<script setup lang="ts">
import { WiTextarea } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiTextarea size="small" label="Small" rows="3" />
    <WiTextarea variant="filled" label="Filled" rows="3" />
    <WiTextarea size="large" fluid label="Large Fluid" rows="3" />
  </div>
</template>
```

## AutoResize & Invalid

`autosize`（或别名 `autoResize`）会随内容增高；可传 `{ minRows, maxRows }` 限制范围。`invalid`（或别名 `error`）表示校验失败。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTextarea } from '@well-insight/ui'

const value = ref('Line 1\nLine 2')
const limited = ref('Clamped height')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiTextarea v-model="value" autosize label="Auto resize" />
    <WiTextarea v-model="limited" :autosize="{ minRows: 3, maxRows: 6 }" label="min 3 / max 6" />
    <WiTextarea invalid label="Required" help-text="This field is required" model-value="" />
  </div>
</template>
```

## Clearable & count

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTextarea } from '@well-insight/ui'

const value = ref('Draft notes')
</script>

<template>
  <WiTextarea v-model="value" label="Notes" clearable show-count :maxlength="120" :rows="3" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `error` | `boolean` | `false` | **别名**，请优先使用 `invalid`。 |
| `id` | `string` | — | 原生 id。 |
| `rows` | `number` | `4` | 可见行数。 |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | CSS resize；autosize 时强制 `none`。 |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | 按内容自动增高，可限制行数。 |
| `autoResize` | `boolean` | `false` | **别名**，等价于 `autosize`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 样式变体。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `clearable` | `boolean` | `false` | 显示清除按钮。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `showCount` | `boolean` | `false` | 显示字数统计。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `clear` | — | 点击清除时触发。 |
