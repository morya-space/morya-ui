---
title: Button
category: 01 / PRIMITIVE
description: Button triggers an immediate action.
---

# Button

Button triggers an immediate action.

## Import

```ts
import { WdButton } from '@well-insight/ui'
```

## Basic

Show button text via the default slot or the `label` prop.

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton>Submit</WdButton>
    <WdButton label="Label Prop" />
    <WdButton severity="secondary" label="Secondary" />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted.

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton label="Primary" />
    <WdButton label="Secondary" severity="secondary" />
    <WdButton label="Success" severity="success" />
    <WdButton label="Info" severity="info" />
    <WdButton label="Warn" severity="warn" />
    <WdButton label="Help" severity="help" />
    <WdButton label="Danger" severity="danger" />
    <WdButton label="Contrast" severity="contrast" />
  </div>
</template>
```

## Styles

`outlined`, `text`, `link`, `raised`, `rounded`, and `plain` can be combined freely.

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdButton label="Outlined" outlined />
      <WdButton label="Success" severity="success" outlined />
      <WdButton label="Danger" severity="danger" outlined />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdButton label="Raised" raised />
      <WdButton label="Rounded" rounded />
      <WdButton label="Plain Text" text plain />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdButton label="Small" size="small" />
      <WdButton label="Large" size="large" />
      <WdButton label="Fluid" fluid />
    </div>
  </div>
</template>
```

## Text & Link

`text` is a lightweight text button; `link` renders as an inline link style. Both can be combined with `severity`.

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton label="Text" text />
    <WdButton label="Text Danger" text severity="danger" />
    <WdButton label="Link" link />
    <WdButton label="Link Secondary" link severity="secondary" />
  </div>
</template>
```

## Icons & Badge

Supports `icon`, `iconPos`, `iconOnly`, and a `badge`.

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton icon="check" label="Save" />
    <WdButton icon="search" label="Search" icon-pos="right" severity="secondary" />
    <WdButton icon="plus" icon-only rounded aria-label="Add" />
    <WdButton icon="trash" icon-only rounded outlined severity="danger" aria-label="Delete" />
    <WdButton label="Messages" badge="2" badge-severity="danger" severity="secondary" />
  </div>
</template>
```

## Loading

In the `loading` state, a spinner is shown and clicks are blocked.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton } from '@well-insight/ui'

const loading = ref(false)

function toggleLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 900)
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton label="Search" icon="search" :loading="loading" @click="toggleLoading" />
    <WdButton label="Always Loading" loading severity="secondary" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton label="Disabled" disabled />
    <WdButton label="Disabled Outlined" outlined disabled />
    <WdButton label="Disabled Text" text disabled />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Button text. Default slot content takes precedence when present. |
| `icon` | `IconName \| Component` | — | Icon name or custom component. |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Icon position relative to the label. |
| `iconOnly` | `boolean` | `false` | Force a square icon-only button. |
| `severity` | `'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` | — | Semantic color. Defaults to primary when omitted. |
| `variant` | `'outlined' \| 'text' \| 'link'` | — | Style variant shortcut, equivalent to the matching boolean prop. |
| `outlined` | `boolean` | `false` | Outlined button. |
| `text` | `boolean` | `false` | Text button. |
| `link` | `boolean` | `false` | Link button. |
| `raised` | `boolean` | `false` | Raised shadow. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `plain` | `boolean` | `false` | Muted color; often combined with `text` / `outlined`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. Medium by default; `sm` / `lg` aliases supported. |
| `fluid` | `boolean` | `false` | Stretch to full container width. |
| `block` | `boolean` | `false` | **Deprecated**; use `fluid`. |
| `loading` | `boolean` | `false` | Loading state; disables clicks and shows a spinner. |
| `disabled` | `boolean` | `false` | Disabled. |
| `badge` | `string` | — | Badge text. |
| `badgeSeverity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null` | `null` | Badge semantic color. |
| `autofocus` | `boolean` | `false` | Native autofocus. |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `ariaLabel` | `string` | — | Accessible name; recommended for icon-only buttons. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Fired on click when enabled. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button content; takes precedence over `label`. |
| `icon` | Custom icon. |
| `loadingicon` | Custom loading icon. |

## Instance

| Method / Property | Description |
| --- | --- |
| `focus()` | Focus the underlying button. |
| `ref` | Underlying `HTMLButtonElement`. |

## Accessibility

- Renders a native `<button>`.
- For icon-only buttons, set `ariaLabel` (or provide an accessible text label).
- Sets `aria-busy` while `loading` and disables interaction.
