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

**Validation contract:** no external schema validator dependency. `validate()` **always resolves** `{ valid, errors, warnings }` and does not `reject` on failure.

**Field names:** nested paths are supported — `'user.name'`, `'items[0].title'`, or the array form `['items', index, 'title']`. Registration keys and `errors` keys use the canonical path string.

**Warning rules:** add `warningOnly: true` to a rule to surface a message without blocking submit. Warnings land in `warnings` and render in the warning tone.


## When to use

- Form layout and field validation. Declarative rules, label alignment, and inline layout. validate() always resolves and never rejects

## Import

```ts
import type { FormInstance, FormRules } from 'morya-ui'
import { MForm, MFormItem, MFormList, useForm } from 'morya-ui'
```

## Declarative rules

```vue preview src="./demos/DeclarativeRules.en.vue"
```

## Controlled instance (useForm)

`useForm()` returns a stable handle. Pass it to `<MForm :form="form">` for imperative access to the model and validation:

```ts
const form = useForm()

form.setFieldsValue({ name: 'Ada', 'user.role': 'admin' })
form.getFieldValue('name')        // 'Ada'
form.getFieldsValue()             // { name: 'Ada', user: { role: 'admin' } }

const { valid, errors } = await form.validate()
```

When no `model` prop is given the form uses an internal model, so `useForm` works standalone.

## Dynamic fields (MFormList)

`MFormList` manages an array field and exposes `fields` / `add` / `remove` / `move` through its scoped slot:

```vue
<MFormList name="items" :initial-value="() => ({ title: '' })" :rules="{ required: true, message: 'At least one row' }">
  <template #default="{ fields, add, remove }">
    <MFormItem
      v-for="field in fields"
      :key="field.key"
      :name="['items', field.name, 'title']"
      label="Title"
    >
      <MInput v-model="model.items[field.name].title" />
    </MFormItem>
    <MButton @click="add()">Add</MButton>
    <MButton @click="remove(fields.length - 1)">Remove</MButton>
  </template>
</MFormList>
```

> The slot exposes `path`, not `name` — `name` is Vue's reserved slot attribute.

## Callback validation (compatible)

```vue preview src="./demos/CallbackValidationCompatible.en.vue"
```

## Inline layout and label alignment

```vue preview src="./demos/InlineLayoutAndLabelAlignment.en.vue"
```

## Props — Form

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | Values read by `rules`; omit to use an internal model |
| `form` | `FormInstance` | — | Controlled instance from `useForm()` |
| `initialValues` | `Record<string, unknown>` | — | Seeded into the model once on mount; keys accept dot paths |
| `rules` | `FormRules` | — | Rules keyed by field `name` |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Label placement |
| `labelPlacement` | `'top' \| 'left'` | — | Alias of `labelPosition` |
| `labelAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Label text alignment |
| `labelWidth` | `string \| number` | — | Left label width; numbers are px |
| `inline` | `boolean` | `false` | Place items in a wrapping row |
| `requireMark` | `boolean` | `true` | Required asterisk (`required` or `rules.required`) |
| `requiredMark` | `boolean` | — | Alias of `requireMark`  |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | Inherited by nested controls that omit their own `size` |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| 'input' \| array` | `['submit']` | Default timing; rules without `trigger` inherit this |
| `scrollToFirstError` | `boolean \| ScrollIntoViewOptions` | `false` | After a failed validate, scroll to the first error field |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Props — FormItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `NamePath` | — | Field name; nested paths supported (registered on Form, matches `model` / `rules`, also sets `data-m-field`) |
| `dependencies` | `NamePath[]` | — | Paths this field depends on; the field re-validates when any change |
| `rules` | `FormItemRule \| FormItemRule[]` | — | Item rules, merged after Form `rules[name]` |
| `validate` | `(trigger?) => string \| boolean \| void \| Promise<…>` | — | Callback validator; return error text or `false` |
| `error` | `string` | — | Controlled error (wins over internal result) |
| `invalid` / `help` / `required` / `label` | — | — | Layout and display |

> A field reports only the first failing rule. Use `warningOnly` when the message should not block submission.

## FormItemRule

| Field | Description |
| --- | --- |
| `required` | Fails on `null`, blank strings, and empty arrays |
| `type` | Built-in type check: `string` / `number` / `integer` / `boolean` / `array` / `object` / `email` / `url` / `date`; empty values are skipped |
| `min` / `max` | String/array length, or a finite number value |
| `len` | Exact length (string / array) or exact value (number) |
| `pattern` | Checked only for non-empty strings |
| `enum` | Value must belong to the given set |
| `transform` | Transform the value before evaluation, e.g. `v => String(v).toUpperCase()` |
| `whitespace` | Set `false` so `required` accepts whitespace-only strings |
| `warningOnly` | Produce a warning only; the form stays valid |
| `message` | Error copy; falls back to the matching locale message |
| `trigger` | `'blur' \| 'change' \| 'input' \| 'submit'`; omit to inherit Form `validateOn` |
| `validator` | `(value) => string \| false \| Promise<…>`; `true` / `undefined` pass |

## Events — Form

| Event | Payload | Description |
| --- | --- | --- |
| `submit` | `{ valid }` | Auto-validates only when `validateOn` includes `submit` |
| `validate` | `{ valid, errors, warnings }` | A validation pass finished |

## Expose — Form

| Method / Property | Description |
| --- | --- |
| `validate(nameList?)` | **Always resolves** `{ valid, errors, warnings }`; never rejects on failure |
| `validateFields(nameList?)` | Alias of `validate` |
| `getFieldValue(name)` | Read one field (nested paths supported) |
| `getFieldsValue()` | Snapshot of the current model |
| `setFieldValue(name, value)` | Write one field |
| `setFieldsValue(values)` | Write several fields; keys accept dot paths |
| `clearValidate(nameList?)` | Clear validation state |
| `reset()` | Reset the model to the initial snapshot and clear validation |
| `resetFields(nameList?)` | Reset the given fields (default: all) to the initial snapshot |
| `scrollToField(name, options?)` | Scroll to the FormItem with `name`; `options.focus` focuses the first focusable control |
| `scrollToFirstError(options?)` | Scroll to the first field currently in `errors` (registration order) |
| `errors` / `warnings` | Read-only; current error / warning maps (`Record<string, string>`) |

> `validate` / `clearValidate` / `resetFields` accept a single name or an array of names. An array is treated as multiple field names, so a single nested path must be wrapped: `validate([['items', 0]])`.

### Scroll helpers after validation

Custom controls should keep a focusable node inside the FormItem slot, or ensure the item has `name` (`data-m-field` on the root). You can also call `scrollToField` / `scrollToFirstError` after `validate()`.

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
