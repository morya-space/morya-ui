---
title: Segmented
category: 02 / FORM
description: 分段控制器，单选切换。
---

# Segmented

在互斥选项间切换视图或模式。与 [SelectButton](/components/SelectButton) 不同：Segmented 为轨道 + 选中块样式，且为 **单选** `radiogroup` 语义（非 `aria-pressed` 多选）。

## 引入

```ts
import { MSegmented } from 'morya-ui'
```

## 基础用法

`options` 可为 `string[]` 或 `{ label, value, icon?, disabled? }[]`。

```vue preview src="./demos/Basic.vue"
```

## 通栏与圆角

`block` 均分宽度；`shape="round"` 为胶囊轨道。

```vue preview src="./demos/BlockAndShape.vue"
```

## Props

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 当前值 |
| `options` | `string[] \| SegmentedOption[]` | — | 选项 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸 |
| `block` | `boolean` | `false` | 通栏均分 |
| `disabled` | `boolean` | `false` | 禁用整组 |
| `shape` | `'default' \| 'round'` | `'default'` | 圆角形态 |
| `label` | `string` | — | `radiogroup` 无障碍标签 |
| `name` | `string` | 自动生成 | 原生 `radio` 组名 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) | — | 根节点透传 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 同 `modelValue` | 选中变化 |

## 样式定制

定制 Segmented 时，优先在组件根节点覆盖 CSS 变量，不要依赖内部 DOM 结构或通过深层选择器覆盖样式。滑块会自动跟随选中项的位置和尺寸。

```vue
<MSegmented
  v-model="value"
  :options="options"
  style="
    --m-segmented-track-background: var(--m-color-primary-subtle);
    --m-segmented-thumb-background: var(--m-color-primary);
    --m-segmented-active-text-color: var(--m-color-text-on-primary);
    --m-segmented-radius: var(--m-radius-pill);
  "
/>
```

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--m-segmented-track-padding` | `var(--m-space-1)` | 轨道内边距和滑块与轨道的间距。 |
| `--m-segmented-track-background` | 淡化文本色与表面的混合色 | 整个轨道的背景。 |
| `--m-segmented-thumb-background` | `var(--m-color-surface)` | 选中滑块的背景。 |
| `--m-segmented-thumb-shadow` | `var(--m-shadow-sm)` | 选中滑块的阴影。 |
| `--m-segmented-text-color` | `var(--m-color-text-muted)` | 未选中项文字和图标颜色。 |
| `--m-segmented-active-text-color` | `var(--m-color-text)` | 选中项和 hover 项文字、图标颜色。 |
| `--m-segmented-disabled-text-color` | `var(--m-color-text-disabled)` | 禁用项文字和图标颜色。 |
| `--m-segmented-radius` | `var(--m-radius-control)` | 轨道圆角。`shape="round"` 会覆盖为胶囊圆角。 |
| `--m-segmented-thumb-radius` | 根据轨道圆角和内边距计算 | 滑块及选项内容的圆角；需独立控制时覆盖此变量。 |
| `--m-segmented-motion-duration` | `var(--m-motion-fast)` | 滑块移动和文字颜色变化的时长。 |
| `--m-segmented-motion-easing` | `var(--m-motion-ease)` | 滑块移动和文字颜色变化的缓动函数。 |

## 与 SelectButton

| | Segmented | SelectButton |
| --- | --- | --- |
| 视觉 | 轨道 + 浮起选中项 | 按钮组边框 |
| 多选 | 不支持 | `multiple` |
| ARIA | `radiogroup` + `radio` | `group` + `aria-pressed` |
