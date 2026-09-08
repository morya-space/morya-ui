---
title: Theme
order: 4
description: Light and dark themes, design tokens, and motion preferences.
---

# Theme

Theme support is built into `@wise-kit/ui`. Components consume semantic CSS variables (`--wk-*`) and do not keep a second palette.

Importing `@wise-kit/ui/styles.css` already includes these variables. Theme JS APIs (`useTheme` and friends) come from the same package.

## Light / dark

```ts
import { useTheme } from '@wise-kit/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // or 'dark'
toggleTheme()
```

The button at the top-right of the docs site uses the same API. The preference is written to `data-theme` on `document.documentElement`.

## Design tokens

See the full [Design tokens](/docs/design-tokens) catalog (searchable, grouped by category).

| Token | Use |
| --- | --- |
| `--wk-color-primary` | Brand color |
| `--wk-color-surface` | Page background |
| `--wk-color-text` | Body text |
| `--wk-color-border` | Dividers / strokes |
| `--wk-radius-sm/md/lg` | Radius scale |
| `--wk-space-*` | Spacing scale |
| `--wk-font-size-xs/sm/md/lg` | Component type scale |
| `--wk-opacity-disabled` | Disabled opacity |
| `--wk-z-base` / `--wk-z-overlay` / `--wk-z-dropdown` / `--wk-z-toast` | Overlay stacking (`zIndex` writes `--wk-z-base`) |
| `--wk-menu-min-width` / `--wk-control-affix-*` | Menu min width, input clear-button size |
| `--wk-motion-fast/normal` | Transition duration |

## Density

```ts
import { useDensity } from '@wise-kit/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

This writes `data-wk-density` on `document.documentElement` and scales `--wk-space-*` plus `--wk-control-height-*`.  
At the app level use `createWiseKit({ density: 'compact' })` or `<WkConfigProvider density="compact">`.

The Components page sidebar Theme panel can temporarily change accent, radius, and density for local preview.

## Motion preference

```ts
import { useMotion } from '@wise-kit/ui'

const { preference, setMotion } = useMotion()
setMotion('full') // 'full' | 'reduced' | 'none'
```

- `full`: standard transitions and overlay motion  
- `reduced`: shorter duration, less travel  
- `none`: instant switches  

## Control size and focus

Default control heights follow a compact rhythm:

| Size | Height | Font size |
| --- | --- | --- |
| `small` | `28px` (`--wk-control-height-small`) | `14px` |
| Default / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

Focus uses a **brand border + 2px tinted glow** (not an outset outline ring):

```css
border-color: var(--wk-color-primary-hover);
box-shadow: var(--wk-focus-shadow); /* 0 0 0 2px primary@20% */
```

Related tokens: `--wk-radius-control`, `--wk-control-padding-x-*`, `--wk-button-padding-x-*`, `--wk-focus-shadow` / `--wk-focus-shadow-danger`.

## With ConfigProvider

Theme switching is the visual layer. `WkConfigProvider` / `createWiseKit` own size, copy, overlay mount, and other behavioral defaults. Use both together; see [Configuration](/docs/config).
