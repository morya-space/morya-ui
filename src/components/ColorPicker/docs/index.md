---
title: ColorPicker
category: 02 / FORM
description: 颜色选择器，支持面板取色、透明度与预设色板。
---

# ColorPicker

颜色选择器，支持 HSB 面板取色、透明度调节、预设色板与多种格式显示。

## 何时使用

- 需要完整的颜色选择体验，而非仅输入 hex。
- 需要调节透明度（alpha）时。
- 需要提供预设色板供用户快速选择时。

## 引入

```ts
import { MColorPicker } from "morya-ui";
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 预设色板

```vue preview src="./demos/Presets.vue"
```

## 显示文本与清空

```vue preview src="./demos/ShowText.vue"
```

## 渐变色

启用 `gradient` 后支持线性/径向渐变编辑，可添加/删除/拖拽色标。

```vue preview src="./demos/Gradient.vue"
```

## 渐变值绑定

```vue preview src="./demos/GradientValue.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#1677ff'` | 当前颜色值（hex）或 CSS 渐变字符串。 |
| `gradient` | `boolean` | `false` | 启用渐变色模式。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `disabledAlpha` | `boolean` | `false` | 禁用透明度调节。 |
| `allowClear` | `boolean` | `false` | 显示清空按钮。 |
| `format` | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | 显示格式。 |
| `presets` | `ColorPickerPreset[]` | — | 预设色板。 |
| `showText` | `boolean` | `false` | 在触发器中显示颜色文本。 |
| `size` | `MSizeInput` | — | 尺寸。 |
| `placement` | `ColorPickerPlacement` | `'bottom-start'` | 弹层位置。 |
| `teleport` | `boolean` | `true` | 是否 teleport 到 body。 |
| `appendTo` | `MAppendTo` | `'body'` | 挂载目标。 |
| `transition` | `MotionPresetId \| false` | — | 过渡动画。 |
| `pt` | `FieldPassThrough` | — | DOM 透传。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 颜色变化。 |
| `change` | `string` | 颜色变化（同 `update:modelValue`）。 |
| `clear` | — | 点击清空。 |
| `show` | — | 面板打开。 |
| `hide` | — | 面板关闭。 |

## ColorPickerPreset

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 分组标签。 |
| `colors` | `string[]` | 颜色数组。 |
| `defaultOpen` | `boolean` | 默认展开。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| — | 暂无自定义插槽。 |

## Methods

| 方法名 | 说明 |
| --- | --- |
| `open` | 打开颜色选择面板。 |
| `close` | 关闭颜色选择面板。 |
| `toggle` | 切换颜色选择面板的显示状态。 |
