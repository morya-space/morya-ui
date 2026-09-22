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


## 相关令牌

| Token | 用途 |
| --- | --- |
| `--m-motion-fast/normal/enter/exit` | 过渡时长 |
| `--m-motion-distance` / `--m-motion-ease` | 进出场位移与缓动 |
| `--m-motion-spin*` / `--m-motion-pulse` / `--m-motion-skeleton` | 循环指示器（`reduced`/`none` 下为 `0ms`） |
| `--m-motion-loading-*` | Loading 变体循环时长 |

亮暗主题与密度见 [主题](/docs/theme)；无障碍说明见 [无障碍](/docs/accessibility)。
