---
title: Form
category: 02 / FORM
description: Form layout and field validation. Declarative rules, label alignment, and inline layout. validate() always resolves and never rejects.
---

# Form

`MForm` / `MFormItem` handle layout, required marks, and error display. Validation can use both of these, together:

1. **Declarative `rules` (preferred):** `required` / `min` / `max` / `pattern` / `validator` keyed by field name.
2. **`validate` callback:** return an error string from FormItem. Still useful for cross-field logic.

Rules without `trigger` inherit Form `validateOn`. Programmatic `validate()` and native submit (when `validateOn` includes `submit`) run every rule on the field.

**Validation contract:** no external schema validator dependency. `validate()` **always resolves** `{ valid, errors }` and does not `reject` on failure. Nested paths such as `user.name` are not supported; use flat field names.

## Import

```ts
import type { FormInstance, FormRules } from 'morya-ui'
import { MForm, MFormItem } from 'morya-ui'
```

## Declarative rules

```vue preview src="./demos/DeclarativeRules.en.vue"
```

## Callback validation (compatible)

```vue preview src="./demos/CallbackValidationCompatible.en.vue"
```

## Inline layout and label alignment

```vue preview src="./demos/InlineLayoutAndLabelAlignment.en.vue"
```

## Props — Form

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | Values read by `rules` |
| `rules` | `FormRules` | — | Rules keyed by field `name` |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Label placement |
| `labelPlacement` | `'top' \| 'left'` | — | Alias of `labelPosition` |
| `labelAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Label text alignment |
| `labelWidth` | `string \| number` | — | Left label width; numbers are px |
| `inline` | `boolean` | `false` | Place items in a wrapping row |
| `requireMark` | `boolean` | `true` | Required asterisk (`required` or `rules.required`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| 'input' \| array` | `['submit']` | Default timing; rules without `trigger` inherit this |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Props — FormItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Field name (registered on Form; matches `model` / `rules`) |
| `rules` | `FormItemRule \| FormItemRule[]` | — | Item rules, merged after Form `rules[name]` |
| `validate` | `(trigger?) => string \| boolean \| void \| Promise<…>` | — | Callback validator; return error text or `false` |
| `error` | `string` | — | Controlled error (wins over internal result) |
| `invalid` / `help` / `required` / `label` | — | — | Layout and display |

## FormItemRule

| Field | Description |
| --- | --- |
| `required` | Fails on `null`, blank strings, and empty arrays |
| `min` / `max` | String/array length, or a finite number value |
| `pattern` | Checked only for non-empty strings |
| `message` | Error copy; falls back to locale `required` |
| `trigger` | `'blur' \| 'change' \| 'input' \| 'submit'`; omit to inherit Form `validateOn` |
| `validator` | `(value) => string \| false \| Promise<…>`; `true` / `undefined` pass |

## Events — Form

| Event | Payload | Description |
| --- | --- | --- |
| `submit` | `{ valid }` | Auto-validates only when `validateOn` includes `submit` |
| `validate` | `{ valid, errors }` | A validation pass finished |

## Expose — Form

| Method / Property | Description |
| --- | --- |
| `validate(name?)` | **Always resolves** `{ valid, errors }`; never rejects on failure |
| `clearValidate(name?)` | Clears internal errors |
| `reset()` | Reset the model to the initial snapshot and clear validation |
| `resetFields(names?)` | Reset the given fields (default: all) to the initial snapshot |
| `errors` | Read-only; current validation error map (`Record<string, string>`) |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Form items. |

## Types

<h4 id="FormRules">FormRules</h4>

See source `types.ts` for the full definition.

```ts
type FormRules = Record<string, FormItemRule | FormItemRule[]>
```
