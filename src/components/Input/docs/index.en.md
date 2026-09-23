---
title: Input
category: 02 / FORM
description: Text input field.
---

# Input

Single-line text input.

## Import

```ts
import { MInput } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Invalid

Use `invalid` for validation failure, or rely on `error-message` alone.

```vue preview src="./demos/Invalid.vue"
```

## Clearable

```vue preview src="./demos/Clearable.vue"
```

## Prefix / Suffix

```vue preview src="./demos/PrefixSuffix.en.vue"
```

## Password-like type

```vue preview src="./demos/PasswordLikeType.vue"
```

## Sizes

Supports `small` / `large`, and also `sm` / `md` / `lg`.

```vue preview src="./demos/Sizes.vue"
```

## Count

`showCount` shows the character count; pair with `maxlength` for an upper bound.

```vue preview src="./demos/Count.vue"
```

## Fluid

```vue preview src="./demos/Fluid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Outer attrs & layout

All fallthrough attrs except **control events** (`@keydown`, `@focus`, …) bind to the field wrapper (`.m-input-field`), not the raw `<input>`—including `class`, `style`, `data-*`, `title`, `tabindex`, and undeclared attrs:

```vue preview src="./demos/OuterAttrsAndLayout.en.vue"
```

See [Styling & attrs](/docs/attrs) for library-wide rules.

## Keyboard & focus events

`@keydown`, `@focus`, `@blur`, and similar listeners attach to the underlying input:

```vue preview src="./demos/KeyboardAndFocusEvents.en.vue"
```

## pt

Pass-through per DOM part. Common keys: `root`, `input`, `label`, `prefix`, `suffix`, `help`, `count`.

```vue preview src="./demos/Pt.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `helpText` | `string` | — | Helper text. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `id` | `string` | — | Native id; auto-generated when omitted. |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'url' \| 'tel'` | `'text'` | Native type. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; medium by default. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Style variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `clearable` | `boolean` | `false` | Show clear button. |
| `maxlength` | `number` | — | Native maxlength. |
| `showCount` | `boolean` | `false` | Show character count. |
| `errorMessage` | `string` | — | Error copy; implies invalid when set. |
| `placeholder` | `string` | — | Placeholder. |
| `name` | `string` | — | Native name. |
| `autocomplete` | `string` | — | Native autocomplete. |
| `autofocus` | `boolean` | `false` | Focus on mount. |
| `pt` | [InputPassThrough](/docs/types#InputPassThrough) | — | Pass-through per DOM part; see **pt** above. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Left adornment (unit, icon, and so on). |
| `suffix` | Right adornment; can coexist with the clear button. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value changed. |
| `clear` | — | Fired when clear is clicked. |

## Instance

| Method | Description |
| --- | --- |
| `focus()` | Focus the underlying input. |
| `blur()` | Blur the underlying input. |
| `select()` | Select all text in the input. |

## Types

<h4 id="InputPassThrough">InputPassThrough</h4>

Type of `pt`. Extends [FieldPassThrough](/docs/types#FieldPassThrough) with affix parts:

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

See [PassThroughPart](/docs/types#PassThroughPart) in API types.
