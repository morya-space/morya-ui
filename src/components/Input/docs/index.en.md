---
title: Input
category: 02 / FORM
description: Text input field.
---

# Input

Single-line text input.

## Import

```ts
import { MInput } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

Use `invalid` for validation failure, or rely on `error-message` alone.

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <MInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput v-model="amount" label="Amount" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </MInput>
    <MInput v-model="host" label="Domain" fluid>
      <template #suffix>
        .well.design
      </template>
    </MInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <MInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

Supports `small` / `large`, and also `sm` / `md` / `lg`.

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput size="small" label="Small" placeholder="Small" />
    <MInput label="Normal" placeholder="Normal" />
    <MInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` shows the character count; pair with `maxlength` for an upper bound.

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <MInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <MInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <MInput variant="filled" label="Filled" placeholder="Filled" />
    <MInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput model-value="Read only value" label="Disabled" disabled />
</template>
```

## Outer attrs & layout

All fallthrough attrs except **control events** (`@keydown`, `@focus`, …) bind to the field wrapper (`.m-input-field`), not the raw `<input>`—including `class`, `style`, `data-*`, `title`, `tabindex`, and undeclared attrs:

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const q = ref('')
</script>

<template>
  <MInput
    v-model="q"
    label="Search"
    class="toolbar-search"
    data-testid="search"
    style="max-width: 16rem"
  />
</template>
```

See [Styling & attrs](/docs/attrs) for library-wide rules.

## Keyboard & focus events

`@keydown`, `@focus`, `@blur`, and similar listeners attach to the underlying input:

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInput
    v-model="code"
    label="Code"
    maxlength="6"
    @keydown.enter="$event.target instanceof HTMLInputElement && $event.target.blur()"
  />
</template>
```

## pt

Pass-through per DOM part. Common keys: `root`, `input`, `label`, `prefix`, `suffix`, `help`, `count`.

```vue preview
<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput
    label="Token"
    placeholder="sk-…"
    :pt="{
      root: { class: 'token-field' },
      input: { class: 'font-mono', autocomplete: 'off' },
    }"
  />
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
| `errorMessage` | `string` | — | Error copy; implies invalid when set. |
| `placeholder` | `string` | — | Placeholder. |
| `name` | `string` | — | Native name. |
| `autocomplete` | `string` | — | Native autocomplete. |
| `autofocus` | `boolean` | `false` | Focus on mount. |
| `pt` | [InputPassThrough](/docs/types#InputPassThrough) | — | Pass-through per DOM part; see **pt** above. |

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

## Types

<h4 id="InputPassThrough">InputPassThrough</h4>

Type of `pt`. Extends [FieldPassThrough](/docs/types#FieldPassThrough) with affix parts:

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

See [PassThroughPart](/docs/types#PassThroughPart) in API types.
