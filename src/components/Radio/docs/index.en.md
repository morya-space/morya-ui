---
title: Radio
category: 02 / FORM
description: Radio button. Supports invalid.
---

# Radio

Radio button.

## Import

```ts
import { MRadio } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MRadio } from 'morya-ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio v-model="size" name="size" value="sm" label="Small" />
    <MRadio v-model="size" name="size" value="md" label="Medium" />
    <MRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { MRadio } from 'morya-ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <MRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { MRadio } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio model-value="a" value="a" disabled label="Selected" />
    <MRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Group

```vue preview
<script setup lang="ts">
import { MRadio, MRadioGroup } from 'morya-ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <MRadioGroup v-model="size">
    <MRadio value="sm" label="Small" />
    <MRadio value="md" label="Medium" />
    <MRadio value="lg" label="Large" />
  </MRadioGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | Currently selected value. |
| `value` | `string \| number \| boolean` | — | **Required.** Value of this option. |
| `label` | `string` | — | Label text. You can also use the default slot. |
| `id` | `string` | — | Native id. |
| `name` | `string` | — | Native name. Must match within a group. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | Emitted when the selected value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label. Takes precedence over `label`. |
