---
title: Dialog
category: 05 / FEEDBACK
description: 模态对话框。支持预设页脚、异步关闭拦截、状态 type。
---

# Dialog

模态对话框。可见性使用 `v-model`（`modelValue`），对应 的 `visible`。

## 引入

```ts
import { MButton, MDialog } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Positions

支持 `center` / `top` / `bottom` / `left` / `right` 以及四角位置。

```vue preview src="./demos/Positions.vue"
```

## Footer actions

```vue preview src="./demos/FooterActions.vue"
```

## 遮罩点击

默认点击遮罩不关闭弹窗；设置 `closeOnOutsideClick` 后点击遮罩关闭。

```vue preview src="./demos/NoDismissMask.vue"
```

## Maximizable

`maximizable` 在标题栏提供最大化 / 还原切换。

```vue preview src="./demos/Maximizable.vue"
```

## Fullscreen

通过 `v-model:fullscreen` 让对话框默认进入全屏；配合 `maximizable` 时两者保持同步。

```vue preview src="./demos/Fullscreen.vue"
```

## Draggable

`draggable` 允许按住标题栏拖动面板。默认不会拖出可视区，加 `overflow` 放宽限制；通过实例方法 `resetPosition()` 复位。

```vue preview src="./demos/Draggable.vue"
```

## Destroy on close

`destroy-on-close` 让默认插槽内容在关闭动画结束后被卸载，下次打开重新渲染。

```vue preview src="./demos/DestroyOnClose.vue"
```

## 预设页脚与异步关闭

`positiveText` / `negativeText` 生成确认 / 取消按钮（`footer` 插槽优先）。处理函数返回 `false`（含 Promise）则保持打开。确认型流程请用 [ConfirmDialog](/components/ConfirmDialog)；`type` 只负责 Dialog 标题图标。

```vue preview src="./demos/PresetFooterAndAsyncClose.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `title` | `string` | — | 标题文案。 |
| `closeOnEsc` | `boolean` | `true` | 按 Esc 关闭。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定页面滚动（`modal` 时生效）。 |
| `closeOnOutsideClick` | `boolean` | `false` | 点击遮罩关闭。 |
| `closable` | `boolean` | `true` | 显示关闭按钮。 |
| `closeIcon` | `IconName \| null` | `'close'` | 自定义关闭图标；`null` 使用默认。 |
| `maximizable` | `boolean` | `false` | 显示最大化 / 还原按钮。 |
| `fullscreen` | `boolean` | — | 全屏模式，配合 `v-model:fullscreen` 双向绑定；与 `maximizable` 内部状态保持同步。 |
| `draggable` | `boolean` | `false` | 允许按住标题栏拖动面板。 |
| `overflow` | `boolean` | `false` | `draggable` 时是否允许拖出可视区。 |
| `destroyOnClose` | `boolean` | `false` | 关闭动画结束后卸载默认插槽内容。 |
| `openDelay` | `number` | — | `modelValue` 变 true 后延迟多少 ms 显示。 |
| `closeDelay` | `number` | — | `modelValue` 变 false 后延迟多少 ms 关闭。 |
| `modal` | `boolean` | `true` | 遮罩层。 |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | 对话框位置。 |
| `width` | `string \| number` | — | 对话框宽度；数字按 px 处理（最大化 / 全屏时忽略）。 |
| `top` | `string` | — | 顶部外边距（如 `'15vh'`），仅 `position` 为 `top / topleft / topright` 时生效。 |
| `zIndex` | `number \| string` | — | 强制设置 backdrop 的 `z-index`；多层堆叠时使用。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | — | 标题状态图标 |
| `positiveText` / `negativeText` | `string` | — | 预设页脚按钮；有 `footer` 插槽时忽略 |
| `positiveColor` | [ButtonColor](/docs/types#ButtonColor) | — | 确认按钮颜色 |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | 返回 `false` 则不关闭 |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | X / Esc / 遮罩关闭前；返回 `false` 则保持打开 |
| `ariaLabel` | `string` | — | 对话框可访问名称。 |
| `headerAriaLevel` | `number \| string` | `2` | 标题的 `aria-level`（`role="heading"`）。 |
| `transition` | `string \| false` | `'zoom'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `pt` | [DialogPassThrough](/docs/types#DialogPassThrough) | — | 指定 Dialog 内部部件的透传 attrs。 |

## 样式与 attrs

Dialog Teleport 到 `body` 后，你在组件上写的 fallthrough attrs（`class`、`style`、`data-*`、`title` 等）落在**遮罩层**（`.m-dialog-backdrop`），不是内层 `.m-dialog` 面板。面板宽度用 `width` prop；内层 DOM 用 `pt`。不要依赖页面 scoped CSS 的祖先选择器，因为 Teleport 后页面容器不再是弹窗的 DOM 祖先。

`pt` 可将 `class`、`style`、`data-*` 和原生 attrs 定向到指定部件，在 Teleport 和 scoped 模式下保持稳定：

```vue
<MDialog
  v-model="visible"
  width="48rem"
  :pt="{
    panel: { class: 'account-dialog', style: { '--m-dialog-radius': '1rem' } },
    body: { class: 'account-dialog__body' },
  }"
/>
```

| `pt` 键名 | 目标元素 | 用途 |
| --- | --- | --- |
| `root` | `.m-dialog-backdrop` | 全屏遮罩和浮层根节点。 |
| `zoom` | `.m-dialog-zoom` | 负责进出场缩放的定位容器。 |
| `panel` | `.m-dialog` | 对话框面板，适合局部 CSS 变量、class 和 data 属性。 |
| `header` | `.m-dialog__header` | 标题栏，仅在存在标题、图标或操作按钮时渲染。 |
| `body` | `.m-dialog__body` | 内容区。 |
| `footer` | `.m-dialog__footer` | 页脚，仅在 `footer` 插槽或预设操作按钮存在时渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `update:fullscreen` | `boolean` | 全屏状态变化。 |
| `close` | — | 关闭时触发（关闭动作发起）。 |
| `show` | — | 打开时触发（焦点 / 滚动锁定前）。 |
| `opened` | — | 进入过渡完成后触发。 |
| `hide` | — | 关闭后触发（焦点 / 滚动恢复后）。 |
| `closed` | — | 离开过渡完成后触发。 |
| `maximize` | — | 进入最大化 / 全屏。 |
| `unmaximize` | — | 退出最大化 / 全屏。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `close()` | 关闭对话框（等同取消/关闭动作）。 |
| `maximize()` | 最大化；已最大化时无操作。 |
| `unmaximize()` | 退出最大化。 |
| `resetPosition()` | 拖拽后复位到初始位置。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框内容。 |
| `header` | 自定义标题区。 |
| `footer` | 底部操作区。 |

## 命令式调用（useModal / modal）

不写模板也能弹出对话框：

```ts
import { modal, useModal } from 'morya-ui'

// 模块级单例
modal.confirm({
  title: '确认删除？',
  content: '删除后不可恢复',
  onOk: async () => { await remove() },
})

// 或组件内作用域实例
const dialog = useModal()
dialog.success({ title: '已保存' })
```

每个调用返回 `{ destroy, update }`：`update` 可在打开时改标题/内容，`destroy` 立即关闭并卸载。`modal.destroyAll()` 关闭全部由该 API 创建的对话框。

| 方法 | 说明 |
| --- | --- |
| `info(options)` | 信息弹窗（默认无取消按钮） |
| `success(options)` | 成功弹窗 |
| `warning(options)` | 警告弹窗 |
| `error(options)` | 错误弹窗 |
| `confirm(options)` | 确认弹窗（默认显示取消按钮） |
| `destroyAll()` | 关闭全部 |

`options` 传字符串等价于 `{ content: '...' }`。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 |
| `content` | `string \| VNode` | — | 内容 |
| `type` | `DialogType` | — | 头部状态图标 |
| `okText` / `cancelText` | `string` | locale | 按钮文案 |
| `showCancel` | `boolean` | 状态弹窗 `false`，`confirm` `true` | 是否显示取消按钮 |
| `okColor` | `ButtonColor` | `'primary'` | 确认按钮颜色 |
| `width` / `position` | 同 Dialog | — | 布局 |
| `closeOnOutsideClick` | `boolean` | `false` | 点击遮罩关闭 |
| `onOk` | `() => void \| Promise<void>` | — | 确认回调；返回 Promise 时按钮进入 loading |
| `onCancel` | `() => void` | — | 取消 / 关闭回调 |
| `afterClose` | `() => void` | — | 关闭动画结束后回调 |

> 命令式弹窗就地渲染在挂载容器内（不 Teleport），便于精确销毁。
| `footer` | 底部操作区。 |
