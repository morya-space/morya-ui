---
title: Input
category: 02 / FORM
description: Text input field.
---

# Input

Single-line text input.

## Import

```ts
import { WdInput } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WdInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

Use `invalid` for validation failure, or rely on `error-message` alone.

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
</script>

<template>
  <WdInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <WdInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WdInput v-model="amount" label="Amount" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </WdInput>
    <WdInput v-model="host" label="Domain" fluid>
      <template #suffix>
        .well.design
      </template>
    </WdInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <WdInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

Supports `small` / `large`, and also `sm` / `md` / `lg`.

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WdInput size="small" label="Small" placeholder="Small" />
    <WdInput label="Normal" placeholder="Normal" />
    <WdInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` shows the character count; pair with `maxlength` for an upper bound.

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <WdInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <WdInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <WdInput variant="filled" label="Filled" placeholder="Filled" />
    <WdInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdInput } from '@wex-design/ui'
</script>

<template>
  <WdInput model-value="Read only value" label="Disabled" disabled />
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
