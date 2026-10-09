---
title: Button
category: 01 / BASIC
description: Buttons trigger immediate actions.
---

# Button

Buttons trigger immediate actions.

## When to use

- Use for submit, confirm, navigate, or other immediate actions.
- Prefer `type="primary"` for the main action; use the default button or `type="dashed"` / `type="text"` for secondary actions.
- Use `danger` or `color="danger"` for destructive actions; use `type="text"` / `type="link"` for lightweight inline actions.
- Group related actions with `MButtonGroup`.

## Import

```ts
import { MButton } from "morya-ui";
```

## Examples

### Basic

`type` is sugar for a color/variant pair. The default is an outlined button.

```vue preview src="./demos/Basic.vue"

```

### Color & variant

`color` and `variant` compose freely and win over `type` when both are set.

```vue preview src="./demos/ColorVariant.vue"

```

### Icon

Supports `icon`, `iconPlacement`, and `iconOnly`.

```vue preview src="./demos/Icon.vue"

```

### Size

```vue preview src="./demos/Size.vue"

```

### Disabled

```vue preview src="./demos/Disabled.vue"

```

### Loading

`loading` accepts a boolean or `{ delay, icon }`.

```vue preview src="./demos/Loading.vue"

```

### Ghost

`ghost` makes the background transparent for dark or busy surfaces.

```vue preview src="./demos/Ghost.vue"

```

### Danger

```vue preview src="./demos/Danger.vue"

```

### Block

```vue preview src="./demos/Block.vue"

```

### Shape

```vue preview src="./demos/Shape.vue"

```

### Button group

```vue preview src="./demos/ButtonGroup.en.vue"

```

### Icons & badge

Library extension: `badge` / `badgeColor`.

```vue preview src="./demos/IconsAndBadge.vue"

```

### Ripple & press

Library extension: `ripple` / `press`.

```vue preview src="./demos/RipplePress.vue"

```

## API

Compose styles in this order: `type` → `shape` → `size` → `loading` → `disabled`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | `'default'` | Sugar. When both `color` and `variant` are set, they win. |
| `color` | `'default' \| 'primary' \| 'danger' \| 'success' \| 'info' \| 'warning' \| 'help' \| 'contrast'` | — | Color axis. |
| `variant` | `'solid' \| 'outlined' \| 'dashed' \| 'filled' \| 'text' \| 'link'` | — | Variant axis. |
| `danger` | `boolean` | `false` | Sugar that forces the danger color. `color` wins when set. |
| `ghost` | `boolean` | `false` | Transparent background. Ignored for `text` / `link`. |
| `shape` | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` | Corner shape. |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; can inherit from ConfigProvider. |
| `block` | `boolean` | `false` | Stretch to full container width. |
| `loading` | `boolean \| { delay?: number; icon?: IconName \| Component }` | `false` | Loading state with optional delay and icon. |
| `disabled` | `boolean` | `false` | Disabled; can inherit from ConfigProvider. |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `href` | `string` | — | Renders as `<a>` when set. |
| `target` | `string` | — | Anchor target; requires `href`. |
| `label` | `string` | — | Label text; default slot wins when present. |
| `icon` | `IconName \| Component` | — | Icon name or component. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | Icon placement. |
| `iconOnly` | `boolean` | `false` | Force a square icon-only button. |
| `autoInsertSpace` | `boolean` | `true` | Insert a space between two Chinese characters. |
| `badge` | `string` | — | Badge text. |
| `badgeColor` | `'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'contrast' \| null` | `null` | Badge tone. |
| `ripple` | `boolean` | `false` | Click ripple. |
| `press` | `boolean` | `false` | Press scale. |
| `autofocus` | `boolean` | `false` | Native autofocus. |
| `ariaLabel` | `string` | — | Accessible name; recommended for icon-only buttons. |
| `pt` | `{ root?, icon?, content?, badge? }` | — | Semantic DOM pass-through. |

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

### Exposed

| Member | Description |
| --- | --- |
| `focus()` | Focus the root element. |
| `ref` | Root `HTMLButtonElement` or `HTMLAnchorElement`. |

### MButtonGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | Stretch to full container width. |
| `ariaLabel` | `string` | — | Accessible name for the group. |
| `pt` | `{ root? }` | — | Group wrapper pass-through. |

## Semantic DOM

```text
button.m-button / a.m-button
  span.m-button__ripple*        ← when ripple is on
  span.m-button__icon*          ← icon / loading
  span.m-button__label*         ← label
  span.m-button__badge*         ← badge
```

Override parts with `pt.root` / `pt.icon` / `pt.content` / `pt.badge`.

## FAQ

### How do `type` and `color` / `variant` relate?

`type` maps to a `[color, variant]` pair. When both `color` and `variant` are set, they win.

```vue
<MButton type="primary">click</MButton>
```

equals

```vue
<MButton color="primary" variant="solid">click</MButton>
```

### Color vocabulary across components

Button uses `color` / `variant`. Feedback components such as Badge, Tag, Alert, Message, and Toast still use `severity`.
