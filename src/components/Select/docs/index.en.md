---
title: Select
category: 02 / FORM
description: Form select. Supports multiple tags, remote search, invalid, size, fluid, showClear, and filter. Distinct from the Dropdown action menu.
---

# Select

Form select for choosing one or more values from a list of options.

**Unlike Dropdown:** `MSelect` is a form control. Use `MDropdown` for action menus.

## Import

```ts
import { MSelect } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Clearable

`showClear` (alias: `clearable`) shows a clear button when a value is selected.

```vue preview src="./demos/Clearable.vue"
```

## Invalid

```vue preview src="./demos/Invalid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Sizes

```vue preview src="./demos/Sizes.vue"
```

## Fluid

```vue preview src="./demos/Fluid.vue"
```

## Multiple

With `multiple`, `v-model` is an array. Selected values render as removable tags and the menu stays open after a pick. `maxTagCount` collapses extra tags.

```vue preview src="./demos/Multiple.vue"
```

## Tag

`tag` + `filter` lets the user create an option from the current query (Enter or the create row). Virtual lists are deferred.

```vue preview src="./demos/Tag.vue"
```

## Remote

`remote` skips local filtering and emits `search` as the query changes. Use `loading` for in-flight requests.

```vue preview src="./demos/Remote.vue"
```

## Empty

Shows empty-state text when there are no options or the filter has no matches. Override with `emptyMessage`, otherwise it reads ConfigProvider `locale.emptyMessage`.

```vue preview src="./demos/Empty.en.vue"
```

## Teleport

The menu Teleports to `body` by default (`teleport` + `appendTo`). Set `append-to="self"` or `teleport={false}` to render in place.

```vue preview src="./demos/Teleport.vue"
```

## Styling & attrs

Fallthrough attrs except control **events** bind to the field wrapper; `@keydown` and similar listeners attach to the combobox. Prefer `placeholder` / `name` as props. Use `placement` / `appendTo` for the panel, or `pt` for inner DOM. See [Styling & attrs](/docs/attrs).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number>` | — | Selected value; an array when `multiple`. |
| `options` | [SelectOption](/docs/types#SelectOption)`[]` | — | Options list. |
| `label` | `string` | — | Field label. |
| `helpText` | `string` | — | Help text. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `placeholder` | `string` | — | Placeholder text. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Form required hint. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `fluid` | `boolean` | `false` | Stretch to the container width. |
| `multiple` | `boolean` | `false` | Allow multiple values. |
| `tag` | `boolean` | `false` | Create an option from the filter query (requires `filter`). |
| `remote` | `boolean` | `false` | Skip local filtering and emit `search`. |
| `loading` | `boolean` | `false` | Async loading state. |
| `maxTagCount` | `number` | — | Max visible tags in multiple mode; extras collapse to +N. |
| `showClear` | `boolean` | `false` | Show a clear button when a value is selected. |
| `clearable` | `boolean` | `false` | Alias for `showClear`. |
| `emptyMessage` | `string` | — | Empty-options text. Defaults to ConfigProvider `locale.emptyOptions`. |
| `filter` | `boolean` | `false` | Show a filter input when the menu is open. |
| `teleport` | `boolean` | `true` | Menu Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target. `'self'` renders in place. |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Menu alignment. |
| `transition` | `string \| false` | `'scale-fade'` | Menu enter/exit preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `id` | `string` | — | Control id. |
| `errorMessage` | `string` | — | Validation error copy. |
| `name` | `string` | — | Native name when a hidden input is present. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through (`root`, `control`, …). |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | [SelectModelValue](/docs/types#SelectModelValue) | Emitted when the value changes. |
| `change` | [SelectModelValue](/docs/types#SelectModelValue) | Emitted after a selection or clear. |
| `clear` | — | Emitted when clear is clicked. |
| `show` | — | Emitted when the menu opens. |
| `hide` | — | Emitted when the menu closes. |
| `search` | `string` | Emitted as the filter query changes (`filter` / `remote`). |
| `create` | [SelectOption](/docs/types#SelectOption) `{ label, value, disabled? }` | Emitted when `tag` creates a new option. |

## Slots

| Slot | Description |
| --- | --- |
| `value` | Custom single-select trigger display. |
| `option` | Option `{ option }`. |

## Types

<h4 id="SelectOption">SelectOption</h4>

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

<h4 id="SelectModelValue">SelectModelValue</h4>

Scalar when single-select; array when `multiple`. See [API types](/docs/types#SelectModelValue).
