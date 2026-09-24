---
title: Button
category: 01 / BASIC
description: Button triggers an immediate action.
---

# Button

Button triggers an immediate action.

## Import

```ts
import { MButton } from 'morya-ui'
```

## Basic

Show button text via the default slot or the `label` prop.

```vue preview src="./demos/Basic.vue"
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted.

```vue preview src="./demos/Severity.vue"
```

## Styles

`outlined`, `text`, `link`, `raised`, `rounded`, and `plain` can be combined freely.

```vue preview src="./demos/Styles.vue"
```

## Text & Link

`text` is a lightweight text button; `link` renders as a backgroundless inline link style. Both can be combined with `severity`.

```vue preview src="./demos/TextAndLink.vue"
```

## Ghost & Quaternary

`ghost` is a soft fill matching text hover; `quaternary` is quieter for secondary toolbar actions. Both can be set via `variant`.

```vue preview src="./demos/GhostAndQuaternary.vue"
```

## Button Group

`MButtonGroup` joins adjacent buttons.

```vue preview src="./demos/ButtonGroup.en.vue"
```

## Icons & Badge

Supports `icon`, `iconPos`, `iconOnly`, and a `badge`.

```vue preview src="./demos/IconsAndBadge.vue"
```

## Loading

In the `loading` state, a spinner is shown and clicks are blocked.

```vue preview src="./demos/Loading.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Button text. Default slot content takes precedence when present. |
| `icon` | `IconName \| Component` | — | Icon name or custom component. |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Icon position relative to the label. |
| `iconOnly` | `boolean` | `false` | Force a square icon-only button. |
| `badge` | `string` | — | Badge text. |
| `badgeSeverity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null` | `null` | Badge semantic color. |
| `severity` | `'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` | — | Semantic color. Defaults to primary when omitted. |
| `color` | `string` | — | Custom color; overrides `severity`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. Medium by default; `sm` / `lg` aliases supported. |
| `variant` | `'outlined' \| 'text' \| 'link' \| 'ghost' \| 'quaternary'` | — | Style variant shortcut, equivalent to the matching boolean prop. |
| `outlined` | `boolean` | `false` | Outlined button. |
| `text` | `boolean` | `false` | Text button. |
| `link` | `boolean` | `false` | Link button. |
| `ghost` | `boolean` | `false` | Soft fill matching text hover. |
| `quaternary` | `boolean` | `false` | Extra-quiet text button. |
| `plain` | `boolean` | `false` | Soft fill matching outlined hover; can also mute `text` / `outlined`. |
| `raised` | `boolean` | `false` | Raised shadow. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `fluid` | `boolean` | `false` | Stretch to full container width. |
| `loading` | `boolean` | `false` | Loading state; disables clicks and shows a spinner. |
| `disabled` | `boolean` | `false` | Disabled. |
| `ripple` | `boolean` | `false` | Click ripple ink. Set `true` to enable. |
| `press` | `boolean` | `false` | Slight scale while pressed. Set `true` to enable. |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `autofocus` | `boolean` | `false` | Native autofocus. |
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
