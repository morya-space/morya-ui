---
title: Tag
category: 01 / BASIC
description: 标签用于展示状态或分类。
---

# Tag

标签用于展示状态或分类。

## 引入

```ts
import { MTag } from 'morya-ui'
```

## 基础用法

通过 `value` 或默认插槽展示文案。

```vue preview src="./demos/Basic.vue"
```

## Severity

使用 `severity` 定义语义色；省略时为 primary。兼容旧值 `warning`（映射为 `warn`）。

```vue preview src="./demos/Severity.vue"
```

## Icons

`icon` 传入 `MIcon` 的图标名称。

```vue preview src="./demos/Icons.vue"
```

## Closable

```vue preview src="./demos/Closable.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | 标签文案。存在默认插槽内容时以插槽为准。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `rounded` | `boolean` | `false` | 全圆角。 |
| `icon` | [IconName](/docs/types#IconName) | — | `MIcon` 图标名称。 |
| `closable` | `boolean` | `false` | 显示关闭按钮。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `bordered` | `boolean` | `false` | 描边。 |
| `color` | `string` | — | 自定义颜色。 |
| `disabled` | `boolean` | `false` | 禁用关闭。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `close` | `MouseEvent` | 点击关闭。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `value`。 |
