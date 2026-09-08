---
title: Input
category: 02 / FORM
description: Text input field.
---

# Input

Single-line text input.

## Import

```ts
import { WkInput } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WkInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

Use `invalid` for validation failure, or rely on `error-message` alone.

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
</script>

<template>
  <WkInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <WkInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WkInput v-model="amount" label="Amount" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </WkInput>
    <WkInput v-model="host" label="Domain" fluid>
      <template #suffix>
        .well.design
      </template>
    </WkInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <WkInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

Supports `small` / `large`, and also `sm` / `md` / `lg`.

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WkInput size="small" label="Small" placeholder="Small" />
    <WkInput label="Normal" placeholder="Normal" />
    <WkInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` shows the character count; pair with `maxlength` for an upper bound.

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <WkInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <WkInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <WkInput variant="filled" label="Filled" placeholder="Filled" />
    <WkInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkInput } from '@wise-kit/ui'
</script>

<template>
  <WkInput model-value="Read only value" label="Disabled" disabled />
</template>
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
