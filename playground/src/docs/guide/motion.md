---
title: 动效
order: 6
description: 动效强度偏好、进出场预设与相关设计令牌。
---

# 动效

动效分两层，彼此正交：

1. **强度**：`useMotion` → `full` / `reduced` / `none`（写到 `data-m-motion`）
2. **形态**：命名进出场预设（Vue `<Transition>`）

时长、缓动与位移由 `--m-motion-*` 令牌驱动；完整列表见 [设计令牌](/docs/design-tokens)。

## 动效偏好

```ts
import { useMotion } from 'morya-ui'

const { preference, setMotion } = useMotion()
setMotion('full') // 'full' | 'reduced' | 'none'
```

- `full`：标准过渡与浮层动画  
- `reduced`：缩短时长、弱化位移；循环指示器停掉  
- `none`：立即切换  

文档站组件页侧栏「动效」分段控件调用的是同一套 API。偏好会持久化到 `localStorage`（键名 `morya-ui-motion`）。

系统开启 `prefers-reduced-motion` 时，默认会按减弱策略处理。若仍要保留完整过渡，可在 `createMoryaUI` / `MConfigProvider` 上设 `respectReducedMotion: false`。

## 动效预设（进出场）

浮层组件通过命名预设选择 Vue `<Transition>` 效果，解析优先级：

1. 组件 `transition` prop  
2. `componentDefaults[Component].transition`  
3. `motion.transitions[role]`（`dialog` / `drawer` / `popup` / `toast` / `tooltip` / `overlay`）  
4. 组件内置默认  

内置 id：`fade`、`scale-fade`、`slide-fade`、`zoom`、`dialog`、`slide-up` / `slide-down` / `slide-left` / `slide-right`、`drawer`、`popover`、`loading`、`blockui`、`message`、`none`。  
`transition={false}` 或 `'none'` 关闭 CSS 过渡。

```ts
import { createMoryaUI, registerMotionPreset } from 'morya-ui'

app.use(createMoryaUI({
  motion: { transitions: { popup: 'slide-up', dialog: 'zoom' } },
  componentDefaults: { Select: { transition: 'fade' } },
}))

// 自定义：先写好 .m-brand-enter-active 等 CSS，再注册
registerMotionPreset('brand', { name: 'm-brand' })
```

```vue
<MDialog transition="slide-up" />
<MSelect :transition="false" />
```

```vue preview src="./demos/theme/MotionPresets.vue"
```

切换下拉中的预设后，请重新打开 Dialog / Drawer / Select 或再点一次 Toast，才能看到新的进出场。

## 可选：接入 Animate.css

`morya-ui` **不依赖** Animate.css。若业务需要 bounce / zoomIn 等 keyframe 动效，可在应用侧安装后，用桥接 CSS + `registerMotionPreset` 挂到现有 `transition` API。时长继续用 `--m-motion-enter` / `--m-motion-exit`，即可跟 `useMotion` 强度联动。

```bash
pnpm add animate.css
```

```ts
import { registerMotionPreset } from 'morya-ui'
import 'animate.css'
// 桥接 CSS：把 Animate.css keyframes 映射到 .m-animate-*-enter-active 等
// 完整示例见 demos/theme/animate-css-bridge.css 或下方演示源码

registerMotionPreset('animate-bounce', { name: 'm-animate-bounce' })
registerMotionPreset('animate-zoom', { name: 'm-animate-zoom' })
registerMotionPreset('animate-fade-up', { name: 'm-animate-fade-up' })
```

```vue
<MDialog transition="animate-bounce" />
<MSelect transition="animate-fade-up" />
```

要点：

- Vue `<Transition>` 需要 `.{name}-enter-active` / `leave-active`；把 Animate.css 的 `@keyframes` 写进这些类即可。
- **Dialog / Drawer** 的 Transition 类在遮罩上：遮罩用同时长的 `fadeIn` / `fadeOut`，表达性动画写在内部 `.m-dialog-zoom` / `.m-drawer`，否则面板动效容易被截断或整层遮罩一起弹跳。
- **Select / Toast** 等浮层根节点即 Transition 目标，可直接在 `-enter-active` 上挂 keyframe。

文档站已引入 Animate.css，可直接试用：

```vue preview src="./demos/theme/AnimateCssPresets.vue"
```

## 相关令牌

| Token | 用途 |
| --- | --- |
| `--m-motion-fast/normal/enter/exit` | 过渡时长 |
| `--m-motion-distance` / `--m-motion-ease` | 进出场位移与缓动 |
| `--m-motion-spin*` / `--m-motion-pulse` / `--m-motion-skeleton` | 循环指示器（`reduced`/`none` 下为 `0ms`） |
| `--m-motion-loading-*` | Loading 变体循环时长 |

亮暗主题与密度见 [主题](/docs/theme)；无障碍说明见 [无障碍](/docs/accessibility)。
