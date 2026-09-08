---
title: Radio
category: 02 / FORM
description: Radio button. Supports invalid.
---

# Radio

Radio button.

## Import

```ts
import { WkRadio } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio v-model="size" name="size" value="sm" label="Small" />
    <WkRadio v-model="size" name="size" value="md" label="Medium" />
    <WkRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <WkRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkRadio } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WkRadio model-value="a" value="a" disabled label="Selected" />
    <WkRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Group

```vue preview
<script setup lang="ts">
import { WkRadio, WkRadioGroup } from '@wise-kit/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <WkRadioGroup v-model="size">
    <WkRadio value="sm" label="Small" />
    <WkRadio value="md" label="Medium" />
    <WkRadio value="lg" label="Large" />
  </WkRadioGroup>
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

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | Emitted when the selected value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label. Takes precedence over `label`. |
