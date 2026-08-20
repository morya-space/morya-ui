---
title: Theme
order: 4
description: Light and dark themes, design tokens, and motion preferences.
---

# Theme

Theme support is built into `@well-insight/ui`. Components consume semantic CSS variables (`--wi-*`) and do not keep a second palette.

Importing `@well-insight/ui/styles.css` already includes these variables. Theme JS APIs (`useTheme` and friends) come from the same package.

## Light / dark

```ts
import { useTheme } from '@well-insight/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // or 'dark'
toggleTheme()
```

The button at the top-right of the docs site uses the same API. The preference is written to `data-theme` on `document.documentElement`.

## Design tokens

Common variables:

| Token | Use |
| --- | --- |
| `--wi-color-primary` | Brand color |
| `--wi-color-surface` | Page background |
| `--wi-color-text` | Body text |
| `--wi-color-border` | Dividers / strokes |
| `--wi-radius-sm/md/lg` | Radius scale |
| `--wi-space-*` | Spacing scale |
| `--wi-font-size-xs/sm/md/lg` | Component type scale |
| `--wi-opacity-disabled` | Disabled opacity |
| `--wi-z-base` / `--wi-z-overlay` / `--wi-z-dropdown` / `--wi-z-toast` | Overlay stacking (`zIndex` writes `--wi-z-base`) |
| `--wi-menu-min-width` / `--wi-control-affix-*` | Menu min width, input clear-button size |
| `--wi-motion-fast/normal` | Transition duration |

## Density

```ts
import { useDensity } from '@well-insight/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

This writes `data-wi-density` on `document.documentElement` and scales `--wi-space-*` plus `--wi-control-height-*`.  
At the app level use `createWellInsight({ density: 'compact' })` or `<WiConfigProvider density="compact">`.

The Components page sidebar Theme panel can temporarily change accent, radius, and density for local preview.

## Motion preference

```ts
import { useMotion } from '@well-insight/ui'

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
| `small` | `28px` (`--wi-control-height-small`) | `14px` |
| Default / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

Focus uses a **brand border + 2px tinted glow** (not an outset outline ring):

```css
border-color: var(--wi-color-primary-hover);
box-shadow: var(--wi-focus-shadow); /* 0 0 0 2px primary@20% */
```

Related tokens: `--wi-radius-control`, `--wi-control-padding-x-*`, `--wi-button-padding-x-*`, `--wi-focus-shadow` / `--wi-focus-shadow-danger`.

## With ConfigProvider

Theme switching is the visual layer. `WiConfigProvider` / `createWellInsight` own size, copy, overlay mount, and other behavioral defaults. Use both together; see [Configuration](/docs/config).
