---
title: Form
category: 02 / FORM
description: Form layout and field validation. Declarative rules, label alignment, and inline layout. validate() always resolves and never rejects.
---

# Form

`WiForm` / `WiFormItem` handle layout, required marks, and error display. Validation can use both of these, together:

1. **Declarative `rules` (preferred):** `required` / `min` / `max` / `pattern` / `validator` keyed by field name.
2. **`validate` callback:** return an error string from FormItem. Still useful for cross-field logic.

Rules without `trigger` inherit Form `validateOn`. Programmatic `validate()` and native submit (when `validateOn` includes `submit`) run every rule on the field.

**Difference from Naive UI:** there is no `async-validator` dependency. `validate()` **always resolves** `{ valid, errors }` and does not `reject` on failure. Nested paths such as `user.name` are not supported; use flat field names.

## Import

```ts
import type { FormInstance, FormRules } from '@well-insight/ui'
import { WiForm, WiFormItem } from '@well-insight/ui'
```

## Declarative rules

```vue preview
<script setup lang="ts">
import type { FormInstance, FormRules } from '@well-insight/ui'
import { WiButton, WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive, ref } from 'vue'

const formRef = ref<FormInstance | null>(null)
const model = reactive({ name: '', email: '' })
const rules: FormRules = {
  name: { required: true, message: 'Enter a name', trigger: ['blur', 'input'] },
  email: [
    { required: true, message: 'Enter an email', trigger: 'blur' },
    { pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/, message: 'Enter a valid email', trigger: 'blur' },
  ],
}

async function onSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
}
</script>

<template>
  <WiForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-position="top"
    validate-on="submit"
    style="max-width: 22rem"
    @submit="onSubmit"
  >
    <WiFormItem label="Name" name="name">
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="model.name" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiFormItem label="Email" name="email" help="Used for notifications">
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="model.email" type="email" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiButton native-type="submit" label="Submit" />
  </WiForm>
</template>
```

## Callback validation (compatible)

```vue preview
<script setup lang="ts">
import { WiButton, WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive } from 'vue'

const form = reactive({ name: '' })
</script>

<template>
  <WiForm validate-on="submit" style="max-width: 22rem">
    <WiFormItem
      label="Name"
      name="name"
      required
      :validate="() => (form.name.trim() ? undefined : 'Enter a name')"
    >
      <template #default="{ id, invalid }">
        <WiInput :id="id" v-model="form.name" fluid :invalid="invalid" />
      </template>
    </WiFormItem>
    <WiButton native-type="submit" label="Submit" />
  </WiForm>
</template>
```

## Inline layout and label alignment

```vue preview
<script setup lang="ts">
import { WiForm, WiFormItem, WiInput } from '@well-insight/ui'
import { reactive } from 'vue'

const model = reactive({ city: '', zip: '' })
</script>

<template>
  <WiForm
    :model="model"
    inline
    label-placement="left"
    label-align="right"
    :label-width="72"
    :rules="{ city: { required: true, message: 'Required' } }"
  >
    <WiFormItem label="City" name="city">
      <template #default="{ id }">
        <WiInput :id="id" v-model="model.city" />
      </template>
    </WiFormItem>
    <WiFormItem label="ZIP" name="zip">
      <template #default="{ id }">
        <WiInput :id="id" v-model="model.zip" />
      </template>
    </WiFormItem>
  </WiForm>
</template>
```

## Props — Form

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | Values read by `rules` |
| `rules` | `FormRules` | — | Rules keyed by field `name` |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Label placement |
| `labelPlacement` | `'top' \| 'left'` | — | Alias of `labelPosition` (Naive) |
| `labelAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Label text alignment |
| `labelWidth` | `string \| number` | — | Left label width; numbers are px |
| `inline` | `boolean` | `false` | Place items in a wrapping row |
| `requireMark` | `boolean` | `true` | Required asterisk (`required` or `rules.required`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| 'input' \| array` | `['submit']` | Default timing; rules without `trigger` inherit this |

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

## Events / Expose — Form

| Name | Description |
| --- | --- |
| `submit` | `{ valid }`. Auto-validates only when `validateOn` includes `submit` |
| `validate` | `{ valid, errors }` |
| `validate(name?)` | **Always resolves** `{ valid, errors }`; never rejects on failure |
| `clearValidate(name?)` | Clears internal errors |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Form items. |
