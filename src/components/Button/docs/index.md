---
title: Button
category: 01 / BASIC
description: 触发即时操作的按钮。
---

# Button

触发提交、确认、导航等即时操作。

## 何时使用

- 主操作：`type="primary"`，同一操作区通常只放一个。
- 次操作：默认按钮，或 `type="dashed"` / `type="text"`。
- 内联导航或弱操作：`type="link"` / `type="text"`。
- 破坏性操作：加 `danger`，并配合确认。
- 相邻操作需要拼成一组时：用 `MButtonGroup`（仅视觉拼组）。

## 引入

```ts
import { MButton, MButtonGroup } from 'morya-ui'
```

## 代码演示

### 基础用法

`type` 是 `color` + `variant` 的语法糖。省略时为默认描边按钮。

```vue preview src="./demos/Basic.vue"

```

### 颜色与变体

需要更细控制时直接设 `color` 与 `variant`；二者同时存在时优先于 `type`。

```vue preview src="./demos/ColorVariant.vue"

```

### 图标

`icon` 可配名称或组件；`iconPlacement` 控制位置；纯图标请提供 `ariaLabel`。

```vue preview src="./demos/Icon.vue"

```

### 尺寸

```vue preview src="./demos/Size.vue"

```

### 形状

`shape`：`default` / `round` / `circle` / `square`。

```vue preview src="./demos/Shape.vue"

```

### 危险按钮

`danger` 将颜色切到危险色，并保留当前 `type` / `variant` 形态。

```vue preview src="./demos/Danger.vue"

```

### 幽灵按钮

`ghost` 让背景透明，适合深色或复杂底图。对 `text` / `link` 无效。

```vue preview src="./demos/Ghost.vue"

```

### 加载中

`loading` 可为布尔值，或 `{ delay, icon }`。加载中会禁用点击。

```vue preview src="./demos/Loading.vue"

```

### 不可用

```vue preview src="./demos/Disabled.vue"

```

### Block

`block` 让按钮宽度撑满父容器。

```vue preview src="./demos/Block.vue"

```

### 按钮组

`MButtonGroup` 只做视觉拼组（圆角与边框衔接），没有选中态。需要互斥切换时用 [`SelectButton`](/components/SelectButton)。

```vue preview src="./demos/ButtonGroup.zh.vue"

```

### 水波纹与按压

`ripple` / `press` 默认关闭，需要时显式开启。

```vue preview src="./demos/RipplePress.vue"

```

## API

推荐组合顺序：`type` → `shape` → `size` → `loading` → `disabled`。

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | `'default'` | 语法糖。同时设置 `color` 与 `variant` 时以后者为准。 |
| `color` | `'default' \| 'primary' \| 'danger' \| 'success' \| 'info' \| 'warning' \| 'help' \| 'contrast'` | — | 颜色轴。 |
| `variant` | `'solid' \| 'outlined' \| 'dashed' \| 'filled' \| 'text' \| 'link'` | — | 变体轴。 |
| `danger` | `boolean` | `false` | 危险色语法糖。设置了 `color` 时以 `color` 为准。 |
| `ghost` | `boolean` | `false` | 透明背景。对 `text` / `link` 无效。 |
| `shape` | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` | 形状。 |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；可继承 ConfigProvider。 |
| `block` | `boolean` | `false` | 宽度撑满父容器。 |
| `loading` | `boolean \| { delay?: number; icon?: IconName \| Component }` | `false` | 加载中；可延迟出现并自定义图标。 |
| `disabled` | `boolean` | `false` | 禁用；可继承 ConfigProvider。 |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 `button` 的 `type`。 |
| `href` | `string` | — | 设置后渲染为 `<a>`。 |
| `target` | `string` | — | 链接 `target`，需配合 `href`。 |
| `label` | `string` | — | 文案；默认插槽优先。 |
| `icon` | `IconName \| Component` | — | 图标名称或组件。 |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | 图标位置。 |
| `iconOnly` | `boolean` | `false` | 强制纯图标方形按钮。 |
| `autoInsertSpace` | `boolean` | `true` | 两个汉字之间插入空格。 |
| `ripple` | `boolean` | `false` | 点击水波纹。 |
| `press` | `boolean` | `false` | 按下缩放。 |
| `autofocus` | `boolean` | `false` | 原生 autofocus。 |
| `ariaLabel` | `string` | — | 可访问名称；纯图标按钮建议提供。 |
| `pt` | `{ root?, icon?, content? }` | — | 语义结构透传。 |

### Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 点击时触发；`loading` / `disabled` 时不触发。 |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容，优先于 `label`。 |
| `icon` | 自定义图标。 |
| `loadingicon` | 自定义加载图标。 |

### Instance

| 方法 / 属性 | 说明 |
| --- | --- |
| `focus()` | 聚焦根元素。 |
| `ref` | 根 `HTMLButtonElement` 或 `HTMLAnchorElement`。 |

### MButtonGroup Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | 宽度撑满父容器。 |
| `ariaLabel` | `string` | — | 组的可访问名称。 |
| `pt` | `{ root? }` | — | 组容器透传。 |

## Design Token

复用全局 `--m-*` 令牌，见[设计令牌](/docs/design-tokens)。按钮在根节点暴露 `--m-button-*`（尺寸、圆角、色阶、填充透明度、动效等），主题切换时跟随 `--m-color-*` / `--m-control-*` / `--m-motion-*`。

## Semantic DOM

根节点即交互元素：有 `href` 时为 `<a class="m-button">`，否则为 `<button class="m-button">`。

```text
button.m-button / a.m-button
  span.m-button__ripple*   ← ripple 开启时
  span.m-button__icon*     ← 图标 / loading
  span.m-button__label*    ← 文案
```

可用 `pt.root` / `pt.icon` / `pt.content` 覆盖各节点。更多约定见[样式与 attrs](/docs/attrs)、[Common Props](/docs/common-props)。

## FAQ

### `type` 和 `color` / `variant` 怎么选？

日常优先用 `type`。需要跨色系细调时再用 `color` + `variant`；二者齐全时覆盖 `type`。

| `type` | 等价于 |
| --- | --- |
| `primary` | `color="primary"` + `variant="solid"` |
| `default` | `color="default"` + `variant="outlined"` |
| `dashed` | `color="default"` + `variant="dashed"` |
| `text` | `color="default"` + `variant="text"` |
| `link` | `color="link"` + `variant="link"` |

```vue
<MButton type="primary">保存</MButton>
```

等同于

```vue
<MButton color="primary" variant="solid">保存</MButton>
```

### Button 的 `color` 和其它组件的 `type`？

Button 用 `color` / `variant`（以及外观糖 `type`）描述按钮形态。Badge、Tag、Status、Alert、Message、Toast 等组件的 `type` 表示语义色调，取值不同，不要和 Button 的 `type` 糖混用。

### `text` 和 `link` 怎么区分？

`type="text"`（或 `variant="text"`）保留按钮热区与高度；`type="link"` 更接近内联链接。

## 无障碍

- 默认渲染原生 `<button>`；设置 `href` 时渲染 `<a>`。
- 纯图标按钮请设置 `ariaLabel`（或可见文本）。
- `loading` 时设置 `aria-busy`，并阻止点击。
- 禁用的链接按钮会去掉 `href`，并设置 `aria-disabled` 与 `tabindex="-1"`。
