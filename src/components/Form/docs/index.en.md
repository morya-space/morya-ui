---
title: Form
category: 02 / FORM
description: Form layout and field validation feedback. Supports blur/change/submit timing. Does not include a built-in rules engine.
---

# Form

`WdForm` / `WdFormItem` handle layout and error display. Validation functions are provided by the app; `validateOn` controls when they run.

## Basic + submit validation

```vue preview
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { WdForm, WdFormItem, WdInput, WdButton } from '@well-insight/ui'

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const form = reactive({ name: '', email: '' })

function required(value: string, message: string) {
  return () => (value.trim() ? undefined : message)
}
</script>

<template>
  <WdForm
    ref="formRef"
    label-position="top"
    validate-on="submit"
    style="max-width: 22rem"
    @submit="({ valid }) => valid && undefined"
  >
    <WdFormItem
      label="Name"
      name="name"
      required
      :validate="required(form.name, 'Enter a name')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="form.name" fluid :invalid="invalid" />
      </template>
    </WdFormItem>
    <WdFormItem
      label="Email"
      name="email"
      required
      help="Used for notifications"
      :validate="() => (/.+@.+\..+/.test(form.email) ? undefined : 'Enter a valid email')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="form.email" type="email" fluid :invalid="invalid" />
      </template>
    </WdFormItem>
    <WdButton native-type="submit" label="Submit" />
  </WdForm>
</template>
```

## blur validation

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdForm, WdFormItem, WdInput } from '@well-insight/ui'

const title = ref('')
</script>

<template>
  <WdForm validate-on="blur" style="max-width: 22rem">
    <WdFormItem
      label="Title"
      name="title"
      :validate="() => (title.trim() ? undefined : 'Title is required')"
    >
      <template #default="{ id, invalid }">
        <WdInput :id="id" v-model="title" fluid :invalid="invalid" placeholder="Validates on blur" />
      </template>
    </WdFormItem>
  </WdForm>
</template>
```

## Props — Form

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Label position |
| `labelWidth` | `string` | — | Left label width |
| `requireMark` | `boolean` | `true` | Required asterisk |
| `disabled` | `boolean` | `false` | Disabled state |
| `validateOn` | `'submit' \| 'blur' \| 'change' \| array` | `['submit']` | Validation timing |

## Props — FormItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Field name (registered on Form) |
| `validate` | `() => string \| void \| Promise<…>` | — | Returns error text |
| `error` | `string` | — | Controlled error (takes precedence over internal result) |
| `invalid` / `help` / `required` / `label` | — | — | Same as above |

## Events / Expose — Form

| Event | Description |
| --- | --- |
| `submit` | `{ valid }` |
| `validate` | `{ valid, errors }` |
| `validate()` / `clearValidate()` | Instance methods |
