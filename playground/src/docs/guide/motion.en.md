---
title: Motion
order: 6
description: Motion intensity preferences, enter/exit presets, and related design tokens.
---

# Motion

Motion has two orthogonal layers:

1. **Intensity**: `useMotion` → `full` / `reduced` / `none` (writes `data-m-motion`)
2. **Shape**: named enter/exit presets (Vue `<Transition>`)

Durations, easing, and travel come from `--m-motion-*` tokens; see the full [Design tokens](/docs/design-tokens) catalog.

## Motion preference

```ts
import { useMotion } from 'morya-ui'

const { preference, setMotion } = useMotion()
setMotion('full') // 'full' | 'reduced' | 'none'
```

- `full`: standard transitions and overlay motion  
- `reduced`: shorter duration, less travel; looping indicators stop  
- `none`: instant switches  

The Components page sidebar Motion control uses the same API. The preference is persisted in `localStorage` (`morya-ui-motion`). Component motion follows this setting only and does not read the OS `prefers-reduced-motion` media query.

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

After changing a preset in the dropdowns, reopen Dialog / Drawer / Select or trigger Toast again to replay enter/exit.

## Optional: Animate.css

`morya-ui` does **not** depend on Animate.css. If your app wants keyframe effects such as bounce / zoomIn, install it on the app side and wire it through bridge CSS + `registerMotionPreset` into the existing `transition` API. Keep durations on `--m-motion-enter` / `--m-motion-exit` so they stay linked to `useMotion` intensity.

```bash
pnpm add animate.css
```

```ts
import { registerMotionPreset } from 'morya-ui'
import 'animate.css'
// Bridge CSS: map Animate.css keyframes onto .m-animate-*-enter-active etc.
// Full example: demos/theme/animate-css-bridge.css or the live demo source below

registerMotionPreset('animate-bounce', { name: 'm-animate-bounce' })
registerMotionPreset('animate-zoom', { name: 'm-animate-zoom' })
registerMotionPreset('animate-fade-up', { name: 'm-animate-fade-up' })
```

```vue
<MDialog transition="animate-bounce" />
<MSelect transition="animate-fade-up" />
```

Notes:

- Vue `<Transition>` expects `.{name}-enter-active` / `leave-active`; map Animate.css `@keyframes` onto those classes.
- **Dialog / Drawer** put Transition classes on the backdrop: use a same-duration `fadeIn` / `fadeOut` on the mask, and put the expressive animation on nested `.m-dialog-zoom` / `.m-drawer` so the panel is not cut short and the scrim does not bounce.
- **Select / Toast** and similar overlays transition the panel root, so keyframes can sit directly on `-enter-active`.

This docs site already depends on Animate.css for the live demo:

```vue preview src="./demos/theme/AnimateCssPresets.vue"
```

## Related tokens

| Token | Use |
| --- | --- |
| `--m-motion-fast/normal/enter/exit` | Transition duration |
| `--m-motion-distance` / `--m-motion-ease` | Enter/exit travel and easing |
| `--m-motion-spin*` / `--m-motion-pulse` / `--m-motion-skeleton` | Looping indicators (`0ms` under `reduced`/`none`) |
| `--m-motion-loading-*` | Loading variant loop durations |

Light/dark theme and density: [Theme](/docs/theme). Accessibility notes: [Accessibility](/docs/accessibility).
