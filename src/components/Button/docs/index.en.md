---
title: Button
category: 01 / BASIC
description: Button triggers an immediate action.
---

# Button

Button triggers an immediate action.

## Import

```ts
import { WkButton } from '@wise-kit/ui'
```

## Basic

Show button text via the default slot or the `label` prop.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton>Submit</WkButton>
    <WkButton label="Label Prop" />
    <WkButton severity="secondary" label="Secondary" />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton label="Primary" />
    <WkButton label="Secondary" severity="secondary" />
    <WkButton label="Success" severity="success" />
    <WkButton label="Info" severity="info" />
    <WkButton label="Warn" severity="warn" />
    <WkButton label="Help" severity="help" />
    <WkButton label="Danger" severity="danger" />
    <WkButton label="Contrast" severity="contrast" />
  </div>
</template>
```

## Styles

`outlined`, `text`, `link`, `raised`, `rounded`, and `plain` can be combined freely.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkButton label="Outlined" outlined />
      <WkButton label="Success" severity="success" outlined />
      <WkButton label="Danger" severity="danger" outlined />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkButton label="Raised" raised />
      <WkButton label="Rounded" rounded />
      <WkButton label="Plain Text" text plain />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkButton label="Small" size="small" />
      <WkButton label="Large" size="large" />
      <WkButton label="Fluid" fluid />
    </div>
  </div>
</template>
```

## Text & Link

`text` is a lightweight text button; `link` renders as an inline link style. Both can be combined with `severity`.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton label="Text" text />
    <WkButton label="Text Danger" text severity="danger" />
    <WkButton label="Link" link />
    <WkButton label="Link Secondary" link severity="secondary" />
  </div>
</template>
```

## Ghost & Quaternary

`ghost` is a transparent fill with tinted text; `quaternary` is quieter for secondary toolbar actions. Both can be set via `variant`.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton label="Ghost" ghost />
    <WkButton label="Ghost Danger" ghost severity="danger" />
    <WkButton label="Quaternary" quaternary />
    <WkButton label="Custom" color="#e11d48" />
  </div>
</template>
```

## Button Group

`WkButtonGroup` joins adjacent buttons.

```vue preview
<script setup lang="ts">
import { WkButton, WkButtonGroup } from '@wise-kit/ui'
</script>

<template>
  <WkButtonGroup aria-label="Align">
    <WkButton label="Left" />
    <WkButton label="Center" severity="secondary" />
    <WkButton label="Right" severity="secondary" />
  </WkButtonGroup>
</template>
```

## Icons & Badge

Supports `icon`, `iconPos`, `iconOnly`, and a `badge`.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton icon="check" label="Save" />
    <WkButton icon="search" label="Search" icon-pos="right" severity="secondary" />
    <WkButton icon="plus" icon-only rounded aria-label="Add" />
    <WkButton icon="trash" icon-only rounded outlined severity="danger" aria-label="Delete" />
    <WkButton label="Messages" badge="2" badge-severity="danger" severity="secondary" />
  </div>
</template>
```

## Loading

In the `loading` state, a spinner is shown and clicks are blocked.

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
import { ref } from 'vue'

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
    <WkButton label="Search" icon="search" :loading="loading" @click="toggleLoading" />
    <WkButton label="Always Loading" loading severity="secondary" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkButton label="Disabled" disabled />
    <WkButton label="Disabled Outlined" outlined disabled />
    <WkButton label="Disabled Text" text disabled />
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
| `variant` | `'outlined' \| 'text' \| 'link' \| 'ghost' \| 'quaternary'` | — | Style variant shortcut, equivalent to the matching boolean prop. |
| `outlined` | `boolean` | `false` | Outlined button. |
| `text` | `boolean` | `false` | Text button. |
| `link` | `boolean` | `false` | Link button. |
| `ghost` | `boolean` | `false` | Transparent fill. |
| `quaternary` | `boolean` | `false` | Extra-quiet text button. |
| `color` | `string` | — | Custom color; overrides `severity`. |
| `raised` | `boolean` | `false` | Raised shadow. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `plain` | `boolean` | `false` | Muted color; often combined with `text` / `outlined`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. Medium by default; `sm` / `lg` aliases supported. |
| `fluid` | `boolean` | `false` | Stretch to full container width. |
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
