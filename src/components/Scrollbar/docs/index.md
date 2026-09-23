---
title: Scrollbar
category: 01 / BASIC
description: 可换肤自定义滚动条，提供一致的滚动体验。
---

# Scrollbar

用于替换浏览器原生滚动条，提供跨浏览器一致的可换肤滚动体验。

## 引入

```ts
import { MScrollbar } from 'morya-ui'
```

## 基础用法

用 `height` 固定可视区域高度；不设时跟随父容器高度。

```vue preview src="./demos/Basic.vue"
```

## Max height

仅当内容超出 `max-height` 时出现滚动条。

```vue preview src="./demos/MaxHeight.vue"
```

## Horizontal

内容宽度超出容器时显示横向滚动条。`trigger="none"` 与 `always` 都会常显滑块；默认 `trigger="hover"` 在悬停时显示。

`MLayout`、`MDialog`、`MConfirmDialog`、`MDrawer`、`MSplitter`、`MTable`、`MSelect`、`MTreeSelect`、`MDropdown`、`MContextMenu`、`MPopover`、`MConfirmPopup`、`MMenu`（popup）、`MMenubar`、`MTieredMenu`、`MTabs`、`MGallery`、`MTimeline`（horizontal）、`MTextarea`（autosize `maxRows`）、`MTerminal`、`MOrderList`、`MPickList`、`MTreeTable`、`MVirtualScroller` 等组件已内置本组件。

```vue preview src="./demos/Horizontal.vue"
```

## Always / Native

`always` 常显自定义滑块；`native` 使用浏览器原生滚动条。

```vue preview src="./demos/AlwaysNative.vue"
```

## Manual scroll

通过实例方法 `setScrollTop` / `setScrollLeft` / `scrollTo` / `update` 控制滚动。

```vue preview src="./demos/ManualScroll.zh.vue"
```

## Infinite scroll

滚动到边缘时触发 `end-reached`，可用于无限加载。

```vue preview src="./demos/InfiniteScroll.zh.vue"
```

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `always` | `boolean` | — | — |
| `ariaLabel` | `string` | — | — |
| `ariaOrientation` | `ScrollbarAriaOrientation` | — | — |
| `distance` | `number` | — | — |
| `height` | `string \| number` | — | — |
| `id` | `string` | — | — |
| `maxHeight` | `string \| number` | — | — |
| `minSize` | `number` | — | — |
| `native` | `boolean` | — | — |
| `noresize` | `boolean` | — | — |
| `role` | `string` | — | — |
| `tabindex` | `number \| string` | — | — |
| `tag` | `string` | — | — |
| `trigger` | `'hover' \| 'none'` | — | — |
| `viewClass` | `ScrollbarClassValue` | — | — |
| `viewStyle` | `StyleValue` | — | — |
| `wrapClass` | `ScrollbarClassValue` | — | — |
| `wrapStyle` | `StyleValue` | — | — |
| `width` | `string \| number` | — | 可视区域宽度。 |
| `maxWidth` | `string \| number` | — | 最大宽度。 |
| `ariaMultiselectable` | `boolean` | — | 内容区 `aria-multiselectable`。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| height | `string \| number` | — | 可视区域高度 |
| maxHeight | `string \| number` | — | 最大高度 |
| fitContent | `boolean` | `false` | 随内容增高，配合根节点 CSS `max-height` 使用（下拉面板） |
| native | `boolean` | `false` | 使用原生滚动条 |
| wrapStyle / wrapClass | style / class | — | wrap 容器样式 |
| viewStyle / viewClass | style / class | — | 内容区样式 |
| noresize | `boolean` | `false` | 不监听尺寸变化 |
| tag | `string` | `div` | 内容区标签 |
| always | `boolean` | `false` | 始终显示滑块 |
| trigger | `'hover' \| 'none'` | `'hover'` | `none` 常显滑块；`always` 为 true 时仍常显 |
| minSize | `number` | `20` | 滑块最小尺寸 |
| id / role / ariaLabel / ariaOrientation | a11y | — | 内容区无障碍属性 |
| tabindex | `number \| string` | — | wrap 的 tabindex |
| distance | `number` | `0` | 触发 `end-reached` 的边缘距离 |

### Events

| Name | Payload |
| --- | --- |
| scroll | `{ scrollTop, scrollLeft }` |
| end-reached | `'top' \| 'bottom' \| 'left' \| 'right'` |

### Expose

| 方法 / 属性 | 说明 |
| --- | --- |
| `wrapRef` | wrap 容器元素引用。 |
| `update()` | 重新计算滑块尺寸与位置。 |
| `scrollTo(...)` | 滚动到指定位置（同原生 `scrollTo`）。 |
| `setScrollTop(y)` | 设置纵向滚动位置。 |
| `setScrollLeft(x)` | 设置横向滚动位置。 |
| `handleScroll(event)` | wrap 的 scroll 事件处理，可手动转发。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `scroll` | `{ scrollTop, scrollLeft }` | 滚动位置变化。 |
| `end-reached` | `'top' \| 'bottom' \| 'left' \| 'right'` | 滚动到边缘。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 可滚动内容。 |

## 类型

<h4 id="ScrollbarAriaOrientation">ScrollbarAriaOrientation</h4>

完整定义见源码 `types.ts`。

```ts
type ScrollbarAriaOrientation = 'horizontal' | 'vertical'
```

<h4 id="ScrollbarClassValue">ScrollbarClassValue</h4>

完整定义见源码 `types.ts`。

```ts
type ScrollbarClassValue = | string
  | string[]
  | Record<string, boolean>
  | Array<string | Record<string, boolean> | null | undefined | false>
```
