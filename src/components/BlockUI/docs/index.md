---
title: BlockUI
category: 05 / FEEDBACK
description: 在内容上叠加遮罩以阻止交互。
---

# BlockUI

包裹内容，在 `blocked` 时显示遮罩。

## 引入

```ts
import { MBlockUI } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | 是否遮罩。 |
| `transition` | `string \| false` | `'blockui'` | 进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 默认内容。 |

