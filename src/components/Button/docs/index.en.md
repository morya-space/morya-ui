---
title: Button
category: 01 / PRIMITIVE
description: Button triggers an immediate action.
---

# Button

Button triggers an immediate action.

## Import

```ts
import { WiButton } from '@well-insight/ui'
```

## Basic

Show button text via the default slot or the `label` prop.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton>Submit</WiButton>
    <WiButton label="Label Prop" />
    <WiButton severity="secondary" label="Secondary" />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Primary" />
    <WiButton label="Secondary" severity="secondary" />
    <WiButton label="Success" severity="success" />
    <WiButton label="Info" severity="info" />
    <WiButton label="Warn" severity="warn" />
    <WiButton label="Help" severity="help" />
    <WiButton label="Danger" severity="danger" />
    <WiButton label="Contrast" severity="contrast" />
  </div>
</template>
```

## Styles

`outlined`, `text`, `link`, `raised`, `rounded`, and `plain` can be combined freely.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Outlined" outlined />
      <WiButton label="Success" severity="success" outlined />
      <WiButton label="Danger" severity="danger" outlined />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Raised" raised />
      <WiButton label="Rounded" rounded />
      <WiButton label="Plain Text" text plain />
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Small" size="small" />
      <WiButton label="Large" size="large" />
      <WiButton label="Fluid" fluid />
    </div>
  </div>
</template>
```

## Text & Link

`text` is a lightweight text button; `link` renders as an inline link style. Both can be combined with `severity`.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Text" text />
    <WiButton label="Text Danger" text severity="danger" />
    <WiButton label="Link" link />
    <WiButton label="Link Secondary" link severity="secondary" />
  </div>
</template>
```

## Ghost & Quaternary

`ghost` is a transparent fill with tinted text; `quaternary` is quieter for secondary toolbar actions. Both can be set via `variant`.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Ghost" ghost />
    <WiButton label="Ghost Danger" ghost severity="danger" />
    <WiButton label="Quaternary" quaternary />
    <WiButton label="Custom" color="#e11d48" />
  </div>
</template>
```

## Button Group

`WiButtonGroup` joins adjacent buttons.

```vue preview
<script setup lang="ts">
import { WiButton, WiButtonGroup } from '@well-insight/ui'
</script>

<template>
  <WiButtonGroup aria-label="Align">
    <WiButton label="Left" />
    <WiButton label="Center" severity="secondary" />
    <WiButton label="Right" severity="secondary" />
  </WiButtonGroup>
</template>
```

## Icons & Badge

Supports `icon`, `iconPos`, `iconOnly`, and a `badge`.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton icon="check" label="Save" />
    <WiButton icon="search" label="Search" icon-pos="right" severity="secondary" />
    <WiButton icon="plus" icon-only rounded aria-label="Add" />
    <WiButton icon="trash" icon-only rounded outlined severity="danger" aria-label="Delete" />
    <WiButton label="Messages" badge="2" badge-severity="danger" severity="secondary" />
  </div>
</template>
```

## Loading

In the `loading` state, a spinner is shown and clicks are blocked.

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
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
    <WiButton label="Search" icon="search" :loading="loading" @click="toggleLoading" />
    <WiButton label="Always Loading" loading severity="secondary" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton label="Disabled" disabled />
    <WiButton label="Disabled Outlined" outlined disabled />
    <WiButton label="Disabled Text" text disabled />
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
