---
title: Splitter
category: 06 / LAYOUT
description: 双栏分割布局，支持水平 / 垂直与拖拽调整比例。
---

# Splitter

将内容拆成两个可并排或上下排列的区域，拖动分隔条即可调整比例。

## 引入

```ts
import { MSplitter } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Vertical / direction

`layout` 与 `direction` 等价（`direction` 为别名）。

```vue preview src="./demos/VerticalDirection.vue"
```

## Size modes

- `number > 1`：百分比（如 `35` → 35%）
- `number ≤ 1`：比例（如 `0.35` → 35%）
- `string`：像素（如 `'120px'`）

```vue preview src="./demos/SizeModes.vue"
```

## Disabled

```vue preview src="./demos/Disabled.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 分割方向。 |
| `direction` | 同上 | — | `layout` 的别名。 |
| `size` | `number \| string` | — | 受控尺寸；`>1` 为 `%`，`≤1` 为比例，`'Npx'` 为像素。 |
| `defaultSize` | `number \| string` | `50` | 非受控初始尺寸。 |
| `min` / `max` | `number \| string` | 随模式 | 下限 / 上限（单位与 `size` 一致）。 |
| `disabled` | `boolean` | `false` | 禁用拖拽与键盘调整。 |
| `resizeTriggerSize` | `number` | `6` | 分隔条厚度（px）。 |
| `pane1Class` / `pane1Style` | — | — | 主面板 class / style。 |
| `pane2Class` / `pane2Style` | — | — | 次面板 class / style。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽名 | 说明 |
| --- | --- |
| `panel1` / `1` | 左侧 / 上方面板。 |
| `panel2` / `2` | 右侧 / 下方面板。 |
| `resize-trigger` | 自定义分隔条内容。 |
| `default` | 未使用命名插槽时取前两个子节点。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:size` | `number \| string` | 尺寸变化。 |
| `resize` | 同上 | 便于单独监听。 |
| `drag-start` / `drag-move` / `drag-end` | `Event` | 拖拽生命周期。 |
