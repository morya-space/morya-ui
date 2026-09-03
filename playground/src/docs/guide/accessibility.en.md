---
title: Accessibility
order: 8
description: Accessibility conventions when using Well Insight components.
---

# Accessibility

Well Insight favors **semantic HTML first, ARIA when necessary**. Components handle labels, keyboard paths, and overlay focus where possible; apps still must supply meaningful copy and structure.

## Quick checklist

| Scenario | Guidance |
| --- | --- |
| Icon-only buttons | Set `aria-label` or visible text—do not rely on icon shape alone |
| Form fields | Use `label`; on failure use `invalid` + `error-message` |
| Decorative icons | Omit `label`; the icon is `aria-hidden` |
| Overlays / dialogs | Ensure Escape closes; focus stays manageable while open |
| Motion sensitivity | Use `useMotion()` with `reduced` or `none` |
| Status by color only | Add text, icons, or `error-message` |

## Forms and validation

Input-family components (`Input`, `Textarea`, `Select`, …) share the same field pattern:

```vue
<WiInput
  id="email"
  v-model="email"
  label="Email"
  invalid
  error-message="Enter a valid email address"
/>
```

Notes:

- **`label`** wires to the control; `FloatLabel` also sets `for` on the label element.
- **`invalid`** sets `aria-invalid` and error styling.
- **`error-message`** is linked through `aria-describedby`.
- Mark required fields with native `required` when supported **and** validation copy—not color alone.

## Icons and buttons

`WiIcon` covers **system icons** only. Without `label` the icon is decorative (`aria-hidden`); informative icons need `label`:

```vue
<WiIcon name="info" label="More information" />
<WiButton icon="search" aria-label="Search" icon-only />
```

Prefer default slot / `label` text on buttons; avoid duplicating `aria-label` when visible text exists.

## Overlays and focus

These default to Teleport on `body`, block scroll while open, and close on Escape where applicable:

- `Dialog`, `Drawer`, `CommandMenu`
- `Select`, `Popover`, `Tooltip` (per component)

Triggers should expose:

- `aria-expanded` / `aria-controls` (e.g. `Popover`)
- Visible text or `aria-label`

After closing a modal, return focus to the trigger when your UX requires it.

## Keyboard

| Component | Keys |
| --- | --- |
| `CommandMenu` | `↑`/`↓` move, `Enter` run, `Esc` close |
| `Select` | `Enter`/`Space` open, `↑`/`↓` options, `Esc` close |
| `Tabs` | Arrow keys between tabs (see component doc) |
| `Slider` | Arrow keys adjust value; override naming with `aria-label` |

Document keyboard tables in component `docs/` when adding new widgets.

## Motion and contrast

```ts
import { useMotion } from '@well-insight/ui'

const { setMotion } = useMotion()
setMotion('reduced') // or 'none'
```

`reduced` / `none` shortens or disables `--wi-motion-*` transitions.

Consume colors through `--wi-color-*` tokens for light/dark parity. After theming, spot-check body text and error states on real content.

## In-library improvements

Recent work includes:

- **FloatLabel**: `label[for]` linked to the first input
- **Popover**: trigger `aria-expanded` / `aria-haspopup` / `aria-controls`
- **Slider**: default `aria-label` on a single thumb (overridable)
- **Select / CascadeSelect / TreeSelect / DatePicker**: combobox semantics, keyboard navigation, and field feedback (`invalid` / `error-message` / `help-text`)

## Testing tips

- Complete primary flows with keyboard only (Tab, Enter, Esc, arrows).
- Spot-check forms and dialogs with NVDA or VoiceOver.
- Verify usability under `prefers-reduced-motion: reduce` or `useMotion('none')`.

## See also

- [Theme](/docs/theme): motion preference and tokens
- [Configuration](/docs/config): locale and defaults
