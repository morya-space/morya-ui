---
title: Textarea
category: 02 / FORM
description: 多行文本输入。
---

# Textarea

多行文本输入。

## 引入

```ts
import { MTextarea } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Size & Variant

```vue preview src="./demos/SizeAndVariant.vue"
```

## AutoResize & Invalid

`autosize` 会随内容增高；可传 `{ minRows, maxRows }` 限制范围。`invalid` 表示校验失败。

```vue preview src="./demos/AutoresizeAndInvalid.vue"
```

## Clearable & count

```vue preview src="./demos/ClearableAndCount.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `id` | `string` | — | 原生 id。 |
| `rows` | `number` | `4` | 可见行数。 |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | CSS resize；autosize 时强制 `none`。 |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | 按内容自动增高，可限制行数。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 样式变体。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `clearable` | `boolean` | `false` | 显示清除按钮。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `showCount` | `boolean` | `false` | 显示字数统计。 |
| `errorMessage` | `string` | — | 错误文案。 |
| `placeholder` | `string` | — | 占位符。 |
| `name` | `string` | — | 原生 name。 |
| `autocomplete` | `string` | — | 原生 autocomplete。 |
| `autofocus` | `boolean` | `false` | 挂载后聚焦。 |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 分段透传（`root`、`input`、`label` 等）。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `clear` | — | 点击清除时触发。 |
| `blur` | — | — |
| `change` | — | — |
| `focus` | — | — |

## Slots

无插槽。
