---
title: SplitButton
category: 01 / BASIC
description: 主操作按钮附带下拉菜单项。
---

# SplitButton

左侧主按钮触发 `click`，右侧展开菜单项触发 `command`。

## 引入

```ts
import { MSplitButton } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 主按钮文案。 |
| `icon` | `string` | — | 可选图标字符。 |
| `model` | `{ label, command?, disabled? }[]` | `[]` | 菜单项。 |
| `severity` / `outlined` / `size` | — | — | 视觉变体。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `teleport` | `boolean` | `true` | 是否将菜单 Teleport 出去。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 表示就地渲染。 |
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 主按钮点击。 |
| `command` | `item` | 菜单项激活。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 主按钮内容。 |
