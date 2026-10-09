---
title: Button
category: 01 / BASIC
description: A button that triggers an immediate action.
---

# Button

Use Button for submit, confirm, navigate, and other immediate actions.

## When to use

- Primary action: `type="primary"`. Keep one primary action in a region.
- Secondary action: the default button, or `type="dashed"` / `type="text"`.
- Inline or low-emphasis action: `type="link"` / `type="text"`.
- Destructive action: add `danger`, and confirm when needed.
- Adjacent actions that should look joined: wrap them in `MButtonGroup` (visual only).

## Import

```ts
import { MButton, MButtonGroup } from 'morya-ui'
```

## Examples

### Basic

`type` is sugar for a `color` + `variant` pair. Omit it for the default outlined button.

```vue preview src="./demos/Basic.vue"

```

### Color & variant

Set `color` and `variant` for finer control. When both are set, they win over `type`.

```vue preview src="./demos/ColorVariant.vue"

```

### Icon

`icon` accepts a name or component. Use `iconPlacement` for position. Icon-only buttons need `ariaLabel`.

```vue preview src="./demos/Icon.vue"

```

### Size

```vue preview src="./demos/Size.vue"

```

### Shape

`shape`: `default` / `round` / `circle` / `square`.

```vue preview src="./demos/Shape.vue"

```

### Danger

`danger` switches the color to danger while keeping the current `type` / `variant` look.

```vue preview src="./demos/Danger.vue"

```

### Ghost

`ghost` makes the background transparent for dark or busy surfaces. It is ignored for `text` / `link`.

```vue preview src="./demos/Ghost.vue"

```

### Loading

`loading` accepts a boolean or `{ delay, icon }`. Clicks are blocked while loading.

```vue preview src="./demos/Loading.vue"

```

### Disabled

```vue preview src="./demos/Disabled.vue"

```

### Block

`block` stretches the button to the parent width.

```vue preview src="./demos/Block.vue"

```

### Button group

`MButtonGroup` only joins adjacent buttons visually. It has no selected state. For mutually exclusive switching, use [`SelectButton`](/components/SelectButton).

```vue preview src="./demos/ButtonGroup.en.vue"

```

### Ripple & press

`ripple` and `press` are off by default. Turn them on when you want the motion.

```vue preview src="./demos/RipplePress.vue"

```

## API

Suggested composition order: `type` → `shape` → `size` → `loading` → `disabled`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | `'default'` | Sugar. When both `color` and `variant` are set, they win. |
| `color` | `'default' \| 'primary' \| 'danger' \| 'success' \| 'info' \| 'warning' \| 'help' \| 'contrast'` | — | Color axis. |
| `variant` | `'solid' \| 'outlined' \| 'dashed' \| 'filled' \| 'text' \| 'link'` | — | Variant axis. |
| `danger` | `boolean` | `false` | Danger-color sugar. `color` wins when set. |
| `ghost` | `boolean` | `false` | Transparent background. Ignored for `text` / `link`. |
| `shape` | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` | Corner shape. |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; can inherit from ConfigProvider. |
| `block` | `boolean` | `false` | Stretch to the parent width. |
| `loading` | `boolean \| { delay?: number; icon?: IconName \| Component }` | `false` | Loading state with optional delay and icon. |
| `disabled` | `boolean` | `false` | Disabled; can inherit from ConfigProvider. |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button `type`. |
| `href` | `string` | — | Renders as `<a>` when set. |
| `target` | `string` | — | Anchor `target`; requires `href`. |
| `label` | `string` | — | Label text; the default slot wins when present. |
| `icon` | `IconName \| Component` | — | Icon name or component. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | Icon placement. |
| `iconOnly` | `boolean` | `false` | Force a square icon-only button. |
| `autoInsertSpace` | `boolean` | `true` | Insert a space between two Chinese characters. |
| `ripple` | `boolean` | `false` | Click ripple. |
| `press` | `boolean` | `false` | Press scale. |
| `autofocus` | `boolean` | `false` | Native autofocus. |
| `ariaLabel` | `string` | — | Accessible name; recommended for icon-only buttons. |
| `pt` | `{ root?, icon?, content? }` | — | Semantic DOM pass-through. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Fired on click; suppressed while `loading` / `disabled`. |

### Slots

| Slot | Description |
| --- | --- |
| `default` | Button content; wins over `label`. |
| `icon` | Custom icon. |
| `loadingicon` | Custom loading icon. |

### Instance

| Member | Description |
| --- | --- |
| `focus()` | Focus the root element. |
| `ref` | Root `HTMLButtonElement` or `HTMLAnchorElement`. |

### MButtonGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | Stretch to the parent width. |
| `ariaLabel` | `string` | — | Accessible name for the group. |
| `pt` | `{ root? }` | — | Group wrapper pass-through. |

## Design Token

Reuses global `--m-*` tokens; see [Design Tokens](/docs/design-tokens). Button exposes `--m-button-*` on the root (size, radius, tones, fill opacity, motion). Theme switches follow `--m-color-*` / `--m-control-*` / `--m-motion-*`.

## Semantic DOM

The root is the interactive element: `<a class="m-button">` when `href` is set, otherwise `<button class="m-button">`.

```text
button.m-button / a.m-button
  span.m-button__ripple*   ← when ripple is on
  span.m-button__icon*     ← icon / loading
  span.m-button__label*    ← label
```

Override parts with `pt.root` / `pt.icon` / `pt.content`. See also [Attrs](/docs/attrs) and [Common Props](/docs/common-props).

## FAQ

### How do I choose between `type` and `color` / `variant`?

Prefer `type` for everyday use. Reach for `color` + `variant` when you need finer cross-tone control. When both axes are set, they override `type`.

| `type` | Equals |
| --- | --- |
| `primary` | `color="primary"` + `variant="solid"` |
| `default` | `color="default"` + `variant="outlined"` |
| `dashed` | `color="default"` + `variant="dashed"` |
| `text` | `color="default"` + `variant="text"` |
| `link` | `color="link"` + `variant="link"` |

```vue
<MButton type="primary">Save</MButton>
```

equals

```vue
<MButton color="primary" variant="solid">Save</MButton>
```

### Button `color` vs other components' `type`?

Button uses `color` / `variant` (plus appearance sugar `type`) for button look. On Badge, Tag, Status, Alert, Message, and Toast, `type` means semantic tone with a different value set—do not mix it with Button's sugar `type`.

### `text` vs `link`?

`type="text"` (or `variant="text"`) keeps button height and hit area. `type="link"` is closer to an inline link.

## Accessibility

- Renders a native `<button>` by default; renders `<a>` when `href` is set.
- Provide `ariaLabel` (or visible text) for icon-only buttons.
- Sets `aria-busy` while `loading` and blocks interaction.
- A disabled link button drops `href` and sets `aria-disabled` with `tabindex="-1"`.
