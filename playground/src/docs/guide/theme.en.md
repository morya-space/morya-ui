---
title: Theme
order: 5
description: Light and dark themes, design tokens, and motion preferences.
---

# Theme

Theme support is built into `morya-ui`. Components consume semantic CSS variables (`--m-*`) and do not keep a second palette.

Importing `morya-ui/styles.css` already includes these variables. Theme JS APIs (`useTheme` and friends) come from the same package.

## Light / dark

```ts
import { useTheme } from 'morya-ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // or 'dark'
toggleTheme()
```

The button at the top-right of the docs site uses the same API. The preference is written to `data-theme` on `document.documentElement`.

## Design tokens

See the full [Design tokens](/docs/design-tokens) catalog (searchable, grouped by category).

| Token | Use |
| --- | --- |
| `--m-color-primary` | Brand color |
| `--m-color-surface` | Page background |
| `--m-color-text` | Body text |
| `--m-color-border` | Dividers / strokes |
| `--m-radius-sm/md/lg` | Radius scale |
| `--m-space-*` | Spacing scale |
| `--m-font-size-xs/sm/md/lg` | Component type scale |
| `--m-opacity-disabled` | Disabled opacity |
| `--m-z-base` / `--m-z-overlay` / `--m-z-dropdown` / `--m-z-toast` | Overlay stacking (`zIndex` writes `--m-z-base`) |
| `--m-menu-min-width` / `--m-control-affix-*` | Menu min width, input clear-button size |
| `--m-motion-fast/normal/enter/exit` | Transition duration |
| `--m-motion-distance` / `--m-motion-ease` | Enter/exit travel and easing |
| `--m-motion-spin*` / `--m-motion-pulse` / `--m-motion-skeleton` | Looping indicators (`0ms` under `reduced`/`none`) |
| `--m-motion-loading-*` | Loading variant loop durations |

## Density

```ts
import { useDensity } from 'morya-ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

This writes `data-m-density` on `document.documentElement` and scales `--m-space-*` plus `--m-control-height-*`.  
At the app level use `createMoryaUI({ density: 'compact' })` or `<MConfigProvider density="compact">`.

The Components page sidebar Theme panel can temporarily change accent, radius, and density for local preview.

## Motion preference

```ts
import { useMotion } from 'morya-ui'

const { preference, setMotion } = useMotion()
setMotion('full') // 'full' | 'reduced' | 'none'
```

- `full`: standard transitions and overlay motion  
- `reduced`: shorter duration, less travel  
- `none`: instant switches  

Intensity (`useMotion`) is orthogonal to which enter/exit effect is used — see below.

## Motion presets (enter/exit)

Overlay components pick a named Vue `<Transition>` preset. Resolution order:

1. Component `transition` prop  
2. `componentDefaults[Component].transition`  
3. `motion.transitions[role]` (`dialog` / `drawer` / `popup` / `toast` / `tooltip` / `overlay`)  
4. Component built-in default  

Built-in ids: `fade`, `scale-fade`, `slide-fade`, `zoom`, `dialog`, `slide-up` / `slide-down` / `slide-left` / `slide-right`, `drawer`, `popover`, `loading`, `blockui`, `message`, `none`.  
`transition={false}` or `'none'` disables CSS transitions.

```ts
import { createMoryaUI, registerMotionPreset } from 'morya-ui'

app.use(createMoryaUI({
  motion: { transitions: { popup: 'slide-up', dialog: 'zoom' } },
  componentDefaults: { Select: { transition: 'fade' } },
}))

// Custom: provide .m-brand-enter-active CSS, then register
registerMotionPreset('brand', { name: 'm-brand' })
```

```vue
<MDialog transition="slide-up" />
<MSelect :transition="false" />
```

```vue preview src="./demos/theme/MotionPresets.vue"
```

## Control size and focus

Default control heights follow a compact rhythm:

| Size | Height | Font size |
| --- | --- | --- |
| `small` | `28px` (`--m-control-height-small`) | `14px` |
| Default / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

Focus uses a **brand border + 2px tinted glow** (not an outset outline ring):

```css
border-color: var(--m-color-primary-hover);
box-shadow: var(--m-focus-shadow); /* 0 0 0 2px primary@20% */
```

Related tokens: `--m-radius-control`, `--m-control-padding-x-*`, `--m-button-padding-x-*`, `--m-focus-shadow` / `--m-focus-shadow-danger`.

## With ConfigProvider

Theme switching is the visual layer. `MConfigProvider` / `createMoryaUI` own size, copy, overlay mount, and other behavioral defaults. Use both together; see [Configuration](/docs/config).
