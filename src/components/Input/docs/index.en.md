---
title: Input
category: 02 / FORM
description: Text input field.
---

# Input

Single-line text input.

## Import

```ts
import { WiInput } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WiInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

Prefer `invalid`; `error` remains available as an alias.

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <WiInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <WiInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiInput v-model="amount" label="Amount" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </WiInput>
    <WiInput v-model="host" label="Domain" fluid>
      <template #suffix>
        .well.design
      </template>
    </WiInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <WiInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

Supports `small` / `large`, and also `sm` / `md` / `lg`.

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiInput size="small" label="Small" placeholder="Small" />
    <WiInput label="Normal" placeholder="Normal" />
    <WiInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` shows the character count; pair with `maxlength` for an upper bound.

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <WiInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <WiInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <WiInput variant="filled" label="Filled" placeholder="Filled" />
    <WiInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <WiInput model-value="Read only value" label="Disabled" disabled />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `helpText` | `string` | — | Helper text. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `error` | `boolean` | `false` | **Alias**; prefer `invalid`. |
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
