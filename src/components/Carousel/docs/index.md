---
title: Carousel
category: 03 / DATA
description: 轮播展示一组内容项，支持滑动 / 淡入 / 卡片效果。
---

# Carousel

参考 Naive UI 的能力：默认插槽 + `MCarouselItem`、多种过渡、指示点样式与方位、触摸/拖拽/滚轮/键盘、自动播放。

## 引入

```ts
import { MCarousel, MCarouselItem } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Autoplay

`autoplay` 按 `interval`（默认 5000ms）自动切换；悬停或聚焦时暂停。

```vue preview src="./demos/Autoplay.vue"
```

## 过渡效果

`effect` 支持 `slide`（默认）、`fade`、`card`。

```vue preview src="./demos/Effects.zh.vue"
```

## 多图同屏

`slides-per-view` + `space-between` 控制一屏可见数量与间距；可配合 `draggable` 鼠标拖拽。

```vue preview src="./demos/MultiView.zh.vue"
```

## 纵向

`direction="vertical"`，指示点可用 `dot-placement` / `dot-type` 调整。

```vue preview src="./demos/Vertical.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentIndex` | `number` | — | 受控当前页，配合 `v-model:currentIndex`。 |
| `defaultIndex` | `number` | `0` | 非受控初始页。 |
| `showArrow` | `boolean` | `false` | 显示箭头。 |
| `showDots` | `boolean` | `true` | 显示指示点。 |
| `dotType` | `'dot' \| 'line'` | `'dot'` | 指示点样式。 |
| `dotPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 指示点位置。 |
| `slidesPerView` | `number \| 'auto'` | `1` | 一屏可见数量（`slide`）。 |
| `spaceBetween` | `number` | `0` | 幻灯片间距（px）。 |
| `centeredSlides` | `boolean` | `false` | 居中当前页。 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向。 |
| `autoplay` | `boolean` | `false` | 自动播放。 |
| `interval` | `number` | `5000` | 自动播放间隔（ms）。 |
| `loop` | `boolean` | `true` | 循环。 |
| `effect` | `'slide' \| 'fade' \| 'card'` | `'slide'` | 过渡效果。 |
| `trigger` | `'click' \| 'hover'` | `'click'` | 指示点触发方式。 |
| `touchable` | `boolean` | `true` | 触摸滑动。 |
| `draggable` | `boolean` | `false` | 鼠标拖拽。 |
| `mousewheel` | `boolean` | `false` | 滚轮切换。 |
| `keyboard` | `boolean` | `false` | 方向键切换（需聚焦）。 |
| `transitionDuration` | `number` | `300` | 过渡时长（ms）。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 幻灯片内容，建议使用 `MCarouselItem`。 |
| `arrow` | `{ prev, next, total, currentIndex }` 自定义箭头。 |
| `dots` | `{ total, currentIndex, to }` 自定义指示点。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:currentIndex` | `(currentIndex, lastIndex)` | 当前页变化。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `prev()` | 上一页。 |
| `next()` | 下一页。 |
| `to(index)` | 跳到指定页。 |
| `getCurrentIndex()` | 获取当前页。 |
