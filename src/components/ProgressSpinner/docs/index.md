---
title: ProgressSpinner
category: 05 / FEEDBACK
description: SVG 环形加载指示器，可配置描边宽度与动画时长。
---

# ProgressSpinner

SVG 环形加载指示器。

## 引入

```ts
import { MProgressSpinner } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Wrap

包裹内容时用 `show` 控制遮罩，`delay` 延迟出现。

```vue preview src="./demos/Wrap.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle 描边宽度。 |
| `animationDuration` | `string` | `'1s'` | 旋转动画时长。 |
| `ariaLabel` | `string` | `'加载中'` | 可访问名称。 |
| `show` | `boolean` | `true` | 包裹内容时是否显示遮罩。 |
| `delay` | `number` | `0` | 显示前延迟（ms）。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `description` | `string` | — | 遮罩下方说明。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 默认内容。 |

