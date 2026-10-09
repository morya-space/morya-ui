---
title: Color
order: 4.51
description: Brand, severity, neutrals, and contrast conventions.
---

# Color

Components consume semantic `--m-*` color variables only—there is no second product palette. Light / dark follows `data-theme` on `document.documentElement` via `useTheme`.

## Principles

- **Brand at the theme entry**: Override `--m-color-primary` (and derived hover / active / bg); pages keep `var(--m-*)`.
- **Semantics over hue**: Buttons, tags, and alerts use `severity`—do not fake status with raw colors.
- **Dark must follow**: Avoid light-only hex in app CSS; rely on `[data-theme="dark"]` overrides.
- **Never color alone**: Pair error / success with copy or icons (see [Accessibility](/docs/accessibility)).

## Core tokens

| Token | Default (light) | Role |
| --- | --- | --- |
| `--m-color-primary` | `#1677ff` | Brand, links, default primary button |
| `--m-color-primary-hover` | `#4096ff` | Primary hover |
| `--m-color-surface` | `#ffffff` | Container / card surface |
| `--m-color-text` | `rgba(0,0,0,0.88)` | Body text |
| `--m-color-text-muted` | `rgba(0,0,0,0.45)` | Secondary copy |
| `--m-color-border` | `#d9d9d9` | Borders |
| `--m-color-split` | `#f0f0f0` | Weaker dividers |
| `--m-color-success` | `#52c41a` | Success |
| `--m-color-info` | `#1677ff` | Info |
| `--m-color-warning` / `--m-color-warn` | `#faad14` | Warning (`warn` alias) |
| `--m-color-danger` | `#ff4d4f` | Danger / error |
| `--m-color-help` | `#9333ea` | Help accent |
| `--m-color-on-emphasis` | `#ffffff` | Foreground on solid emphasis |
| `--m-color-focus-ring` | Tracks primary | Focus-related |
| `--m-opacity-disabled` | `0.55` | Disabled opacity |

Dark example: `--m-color-surface: #141414`, body `rgba(255,255,255,0.85)`. Full catalog: [Design tokens](/docs/design-tokens).

## Severity mapping

| `severity` | Maps to |
| --- | --- |
| (omit / primary) | `--m-color-primary` |
| `secondary` | Neutral secondary treatment |
| `success` | `--m-color-success` |
| `info` | `--m-color-info` |
| `warning` / `warn` | `--m-color-warning` |
| `help` | `--m-color-help` |
| `danger` | `--m-color-danger` |
| `contrast` | `--m-color-contrast` family |

Destructive actions: use `danger` or `color="danger"` on buttons / confirms—do not paint delete as primary.

## Overrides

```css
:root {
  --m-color-primary: #0b6e4f;
}
[data-theme="dark"] {
  --m-color-primary: #3ecf8e;
}
```

Or derive with `createTheme({ seed: { colorPrimary: '…' } })` (see [Theme](/docs/theme)). Live preview: [Theme editor](/theme-editor).

## Do / Don't

| Do | Don't |
| --- | --- |
| One clear primary action; secondary via `secondary` / `outlined` | Several equally solid primary buttons |
| Errors: `danger` + message | Red border alone for validation |
| Weak rules with `--m-color-split` | Heavy borders everywhere |
| Focus with `--m-focus-shadow` | Ad-hoc outline rings that ignore theme |

Next: [Typography](/docs/design-typography).
