---
title: Theme
order: 4
description: Light and dark themes, design tokens, and motion preferences.
---

# Theme

Theme support is built into `@wex-design/ui`. Components consume semantic CSS variables (`--wd-*`) and do not keep a second palette.

Importing `@wex-design/ui/styles.css` already includes these variables. Theme JS APIs (`useTheme` and friends) come from the same package.

## Light / dark

```ts
import { useTheme } from '@wex-design/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // or 'dark'
toggleTheme()
```

The button at the top-right of the docs site uses the same API. The preference is written to `data-theme` on `document.documentElement`.

## Design tokens

Common variables:

| Token | Use |
| --- | --- |
| `--wd-color-primary` | Brand color |
| `--wd-color-surface` | Page background |
| `--wd-color-text` | Body text |
| `--wd-color-border` | Dividers / strokes |
| `--wd-radius-sm/md/lg` | Radius scale |
| `--wd-space-*` | Spacing scale |
| `--wd-font-size-xs/sm/md/lg` | Component type scale |
| `--wd-opacity-disabled` | Disabled opacity |
| `--wd-z-base` / `--wd-z-overlay` / `--wd-z-dropdown` / `--wd-z-toast` | Overlay stacking (`zIndex` writes `--wd-z-base`) |
| `--wd-menu-min-width` / `--wd-control-affix-*` | Menu min width, input clear-button size |
| `--wd-motion-fast/normal` | Transition duration |

## Density

```ts
import { useDensity } from '@wex-design/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

This writes `data-wd-density` on `document.documentElement` and scales `--wd-space-*` plus `--wd-control-height-*`.  
At the app level use `createWexDesign({ density: 'compact' })` or `<WdConfigProvider density="compact">`.

The Components page sidebar Theme panel can temporarily change accent, radius, and density for local preview.

## Motion preference

```ts
import { useMotion } from '@wex-design/ui'

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
| `small` | `28px` (`--wd-control-height-small`) | `14px` |
| Default / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

Focus uses a **brand border + 2px tinted glow** (not an outset outline ring):

```css
border-color: var(--wd-color-primary-hover);
box-shadow: var(--wd-focus-shadow); /* 0 0 0 2px primary@20% */
```

Related tokens: `--wd-radius-control`, `--wd-control-padding-x-*`, `--wd-button-padding-x-*`, `--wd-focus-shadow` / `--wd-focus-shadow-danger`.

## With ConfigProvider

Theme switching is the visual layer. `WdConfigProvider` / `createWexDesign` own size, copy, overlay mount, and other behavioral defaults. Use both together; see [Configuration](/docs/config).
