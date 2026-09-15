---
title: Input
category: 02 / FORM
description: 文本输入框。
---

# Input

单行文本输入。

## 引入

```ts
import { MInput } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Invalid

`invalid` 表示校验失败；也可只传 `error-message`。

```vue preview src="./demos/Invalid.vue"
```

## Clearable

```vue preview src="./demos/Clearable.vue"
```

## Prefix / Suffix

```vue preview src="./demos/PrefixSuffix.zh.vue"
```

## Password-like type

```vue preview src="./demos/PasswordLikeType.vue"
```

## Sizes

支持 `small` / `large`，并兼容 `sm` / `md` / `lg`。

```vue preview src="./demos/Sizes.vue"
```

## Count

`showCount` 显示字数；配合 `maxlength` 展示上限。

```vue preview src="./demos/Count.vue"
```

## Fluid

```vue preview src="./demos/Fluid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## 外层 attrs 与布局

除 `@keydown`、`@focus` 等**控件事件**外，其余 fallthrough attrs（`class`、`style`、`data-*`、`title`、`tabindex` 等）均落在 field 外层（`.m-input-field`），不会直接写到 `<input>`。栅格、间距、测试 id 这样写即可：

```vue preview src="./demos/OuterAttrsAndLayout.zh.vue"
```

更多约定见 [样式与 attrs](/docs/attrs)。

## 键盘与焦点事件

`@keydown`、`@focus`、`@blur` 等绑在底层 input 上，用法与原生 input 相同：

```vue preview src="./demos/KeyboardAndFocusEvents.zh.vue"
```

## pt

按 DOM 分段透传。常用键：`root`、`input`、`label`、`prefix`、`suffix`、`help`、`count`。

```vue preview src="./demos/Pt.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `id` | `string` | — | 原生 id；未传时自动生成。 |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'url' \| 'tel'` | `'text'` | 原生 type。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；默认中等。 |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 样式变体。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `clearable` | `boolean` | `false` | 显示清除按钮。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `showCount` | `boolean` | `false` | 显示字数统计。 |
| `errorMessage` | `string` | — | 错误文案；有值时视为 invalid。 |
| `placeholder` | `string` | — | 占位符。 |
| `name` | `string` | — | 原生 name。 |
| `autocomplete` | `string` | — | 原生 autocomplete。 |
| `autofocus` | `boolean` | `false` | 挂载后聚焦。 |
| `pt` | [InputPassThrough](/docs/types#InputPassThrough) | — | DOM 分段透传，见上文 `pt`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入框左侧装饰（如单位、图标）。 |
| `suffix` | 输入框右侧装饰；与清除按钮可并存。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `clear` | — | 点击清除时触发。 |
| `blur` | — | — |
| `change` | — | — |
| `focus` | — | — |

## Instance

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦底层 input。 |

## 类型

<h4 id="InputPassThrough">InputPassThrough</h4>

`pt` 的类型。在 [FieldPassThrough](/docs/types#FieldPassThrough) 基础上多了前后缀等键：

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

`PassThroughPart` 见 [API 类型 · PassThroughPart](/docs/types#PassThroughPart)。
