---
title: Select
category: 02 / FORM
description: "Form select: mode=multiple|tags, labelInValue, fieldNames, showSearch, allowClear, optionRender, popupRender."
---

# Select

Form select for choosing one or more values from a list of options.

**Unlike Dropdown:** `MSelect` is a form control. Use `MDropdown` for action menus.

## Import

```ts
import { MSelect } from "morya-ui";
```

## Basic

```vue preview src="./demos/Basic.vue"

```

## Clearable

`allowClear` shows a clear button when a value is selected.

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

## Multiple and tag creation

With `mode="multiple"`, `v-model` is an array, selected values render as removable tags, and the menu stays open after a pick.
`mode="tags"` additionally lets the user create an option from the current query (Enter or the create row).

```vue preview src="./demos/Multiple.vue"

```

```vue preview src="./demos/Tag.vue"

```

`maxTagCount` collapses extra tags; the summary is customizable via `maxTagPlaceholder` and defaults to the `moreTags` locale copy.

## labelInValue

When enabled, `v-model` and event payloads become `{ value, label }`:

```vue
<MSelect v-model="picked" label-in-value :options="options" />
```

## fieldNames

Remap option keys when they are not `label` / `value` (works for group children too):

```vue
<MSelect
  :options="[{ title: 'Apple', id: 'apple' }]"
  :field-names="{ label: 'title', value: 'id' }"
/>
```

Extra keys are preserved, so `optionFilterProp` can target a custom field.

## Group

`options` can mix in `{ label, options }` groups ([SelectOptionGroup](/docs/types#SelectOptionGroup)) to render group header rows. Groups are not selectable; searching narrows options within each group and hides empty groups.

```vue preview src="./demos/Group.vue"

```

## Search and filtering

`showSearch` renders a search input in the popup. Local filtering rules:

- `filterOption` omitted / `true`: fuzzy match on `optionFilterProp` (default `label`);
- `filterOption: false`: disable local filtering;
- `filterOption: (input, option) => boolean`: custom predicate.

`remote` skips local filtering and emits `search` as the query changes (pair it with `showSearch`); use `loading` for in-flight requests.

```vue preview src="./demos/Remote.vue"

```

## Custom option rendering

- `optionRender(option)`: custom row content (wins over the `option` slot);
- `popupRender(menu)`: wrap the popup menu;
- `suffixIcon`: replace the trigger chevron.

```vue preview src="./demos/HeaderFooter.vue"

```

## Empty

Shows empty-state text when there are no options or no matches. Override with `notFoundContent`, otherwise it reads ConfigProvider `locale.emptyOptions`.

```vue preview src="./demos/Empty.en.vue"

```

## Teleport

The menu Teleports to `body` by default (`teleport` + `appendTo`). Set `append-to="self"` or `teleport={false}` to render in place.

```vue preview src="./demos/Teleport.vue"

```

## Styling & attrs

Fallthrough attrs except control **events** bind to the field wrapper; `@keydown` and similar listeners attach to the combobox. Prefer `placeholder` / `name` as props. Use `placement` / `appendTo` for the panel, or `pt` for inner DOM. See [Styling & attrs](/docs/attrs).

## Props

| Prop                | Type                                                                                                      | Default                     | Description                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `modelValue`        | `string \| number \| Array<string \| number> \| SelectLabeledValue`                                       | —                           | Selected value; an array in `mode`, or `{ value, label }` with `labelInValue`.   |
| `options`           | `Array<`[SelectOption](/docs/types#SelectOption)`\|`[SelectOptionGroup](/docs/types#SelectOptionGroup)`>` | —                           | Options list; may mix in `{ label, options }` groups.                            |
| `fieldNames`        | `{ label?, value?, disabled?, options? }`                                                                 | —                           | Remap raw option keys.                                                           |
| `labelInValue`      | `boolean`                                                                                                 | `false`                     | `v-model` / events return `{ value, label }`.                                    |
| `label`             | `string`                                                                                                  | —                           | Field label.                                                                     |
| `helpText`          | `string`                                                                                                  | —                           | Help text.                                                                       |
| `invalid`           | `boolean`                                                                                                 | `false`                     | Invalid state.                                                                   |
| `status`            | `'error' \| 'warning'`                                                                                    | —                           | Visual status; `error` matches invalid, `warning` is caution chrome.             |
| `placeholder`       | `string`                                                                                                  | —                           | Placeholder text.                                                                |
| `disabled`          | `boolean`                                                                                                 | `false`                     | Disabled.                                                                        |
| `required`          | `boolean`                                                                                                 | `false`                     | Form required hint.                                                              |
| `size`              | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'`                                                              | —                           | Size; inherits Form `size` when omitted.                                         |
| `variant`           | `'outlined' \| 'filled'`                                                                                  | —                           | Input surface style.                                                             |
| `fluid`             | `boolean`                                                                                                 | `false`                     | Stretch to the container width.                                                  |
| `mode`              | `'multiple' \| 'tags'`                                                                                    | —                           | Multi-value; `tags` also allows creating options.                                |
| `remote`            | `boolean`                                                                                                 | `false`                     | Skip local filtering and emit `search`.                                          |
| `loading`           | `boolean`                                                                                                 | `false`                     | Async loading state.                                                             |
| `maxTagCount`       | `number`                                                                                                  | —                           | Max visible tags; extras collapse.                                               |
| `maxTagPlaceholder` | `(omitted) => MRenderable`                                                                                | `moreTags` locale           | Collapsed-tag summary.                                                           |
| `allowClear`        | `boolean`                                                                                                 | `false`                     | Show a clear button when a value is selected.                                    |
| `notFoundContent`   | `MRenderable`                                                                                             | `emptyOptions` locale       | Empty / no-match copy.                                                           |
| `showSearch`        | `boolean`                                                                                                 | `false`                     | Render a search input in the popup.                                              |
| `optionFilterProp`  | `string`                                                                                                  | `'label'`                   | Option key used for local matching.                                              |
| `filterOption`      | `boolean \| (input, option) => boolean`                                                                   | match on `optionFilterProp` | Local filter rule; `false` disables.                                             |
| `optionRender`      | `(option) => MRenderable`                                                                                 | —                           | Custom option row (wins over the `option` slot).                                 |
| `popupRender`       | `(menu) => VNodeChild`                                                                                    | —                           | Wrap the popup menu.                                                             |
| `suffixIcon`        | `IconName`                                                                                                | `'chevron-down'`            | Trigger icon.                                                                    |
| `teleport`          | `boolean`                                                                                                 | `true`                      | Menu Teleport. Mounts to `body` by default.                                      |
| `appendTo`          | `string \| HTMLElement \| 'self'`                                                                         | `'body'`                    | Mount target. `'self'` renders in place.                                         |
| `placement`         | `'bottom-start' \| 'bottom-end'`                                                                          | `'bottom-start'`            | Menu alignment.                                                                  |
| `transition`        | `string \| false`                                                                                         | `'scale-fade'`              | Menu enter/exit preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `id`                | `string`                                                                                                  | —                           | Control id.                                                                      |
| `errorMessage`      | `string`                                                                                                  | —                           | Validation copy; shown when combined with `invalid`.                             |
| `name`              | `string`                                                                                                  | —                           | Native name helper (hidden input).                                               |
| `pt`                | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }`                    | —                           | Per-part DOM pass-through.                                                       |
| `virtual`           | `boolean`                                                                                                 | auto                        | `true` forces virtualization; `false` disables; auto-on at 80+ options.          |
| `id`                | `string`                                                                                                  | —                           | Control id.                                                                      |
| `errorMessage`      | `string`                                                                                                  | —                           | Validation error copy.                                                           |
| `name`              | `string`                                                                                                  | —                           | Native name when a hidden input is present.                                      |
| `pt`                | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }`                    | —                           | Pass-through (`root`, `control`, …).                                             |

## Events

| Event               | Prop                                                                   | Description                                                |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| `update:modelValue` | [SelectModelValue](/docs/types#SelectModelValue)                       | Emitted when the value changes.                            |
| `change`            | [SelectModelValue](/docs/types#SelectModelValue)                       | Emitted after a selection or clear.                        |
| `clear`             | —                                                                      | Emitted when clear is clicked.                             |
| `show`              | —                                                                      | Emitted when the menu opens.                               |
| `hide`              | —                                                                      | Emitted when the menu closes.                              |
| `search`            | `string`                                                               | Emitted as the filter query changes (`filter` / `remote`). |
| `create`            | [SelectOption](/docs/types#SelectOption) `{ label, value, disabled? }` | Emitted when `tag` creates a new option.                   |

## Slots

| Slot     | Description                                        |
| -------- | -------------------------------------------------- |
| `value`  | Custom single-select trigger display.              |
| `option` | Option `{ option }`.                               |
| `header` | Custom content above the option list in the popup. |
| `footer` | Custom content below the option list in the popup. |

## Types

<h4 id="SelectOption">SelectOption</h4>

```ts
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
```

<h4 id="SelectOptionGroup">SelectOptionGroup</h4>

```ts
interface SelectOptionGroup {
  label: string;
  items: SelectOption[];
}
```

<h4 id="SelectModelValue">SelectModelValue</h4>

Scalar when single-select; array when `multiple`. See [API types](/docs/types#SelectModelValue).
