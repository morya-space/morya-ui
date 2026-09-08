---
title: Theme
order: 4
description: Light and dark themes, design tokens, and motion preferences.
---

# Theme

Theme support is built into `@wise-kit/ui`. Components consume semantic CSS variables (`--rd-*`) and do not keep a second palette.

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

Common variables:

| Token | Use |
| --- | --- |
| `--rd-color-primary` | Brand color |
| `--rd-color-surface` | Page background |
| `--rd-color-text` | Body text |
| `--rd-color-border` | Dividers / strokes |
| `--rd-radius-sm/md/lg` | Radius scale |
| `--rd-space-*` | Spacing scale |
| `--rd-font-size-xs/sm/md/lg` | Component type scale |
| `--rd-opacity-disabled` | Disabled opacity |
| `--rd-z-base` / `--rd-z-overlay` / `--rd-z-dropdown` / `--rd-z-toast` | Overlay stacking (`zIndex` writes `--rd-z-base`) |
| `--rd-menu-min-width` / `--rd-control-affix-*` | Menu min width, input clear-button size |
| `--rd-motion-fast/normal` | Transition duration |

## Density

```ts
import { useDensity } from '@wise-kit/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

This writes `data-rd-density` on `document.documentElement` and scales `--rd-space-*` plus `--rd-control-height-*`.  
At the app level use `createWiseKit({ density: 'compact' })` or `<RdConfigProvider density="compact">`.

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
| `small` | `28px` (`--rd-control-height-small`) | `14px` |
| Default / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

Focus uses a **brand border + 2px tinted glow** (not an outset outline ring):

```css
border-color: var(--rd-color-primary-hover);
box-shadow: var(--rd-focus-shadow); /* 0 0 0 2px primary@20% */
```

Related tokens: `--rd-radius-control`, `--rd-control-padding-x-*`, `--rd-button-padding-x-*`, `--rd-focus-shadow` / `--rd-focus-shadow-danger`.

## With ConfigProvider

Theme switching is the visual layer. `RdConfigProvider` / `createWiseKit` own size, copy, overlay mount, and other behavioral defaults. Use both together; see [Configuration](/docs/config).
