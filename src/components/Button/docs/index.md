---
title: Button
category: 01 / BASIC
description: 按钮用于触发即时动作。
---

# Button

按钮用于触发即时动作。

## 何时使用

- 需要触发表单提交、确认、导航或其它即时操作时。
- 主操作使用 `type="primary"`；次要操作用默认按钮或 `type="dashed"` / `type="text"`。
- 危险操作用 `danger` 或 `color="danger"`；轻量内联操作用 `type="text"` / `type="link"`。
- 相邻一组相关操作用 `MButtonGroup`。

## 引入

```ts
import { MButton } from "morya-ui";
```

## 代码演示

### 基础用法

`type` 是颜色与变体的语法糖。省略时为默认描边按钮。

```vue preview src="./demos/Basic.vue"

```

### 颜色与变体

`color` 与 `variant` 可自由组合；同时设置时优先于 `type`。

```vue preview src="./demos/ColorVariant.vue"

```

### 图标

支持 `icon`、`iconPlacement`、`iconOnly`。

```vue preview src="./demos/Icon.vue"

```

### 尺寸

```vue preview src="./demos/Size.vue"

```

### 不可用

```vue preview src="./demos/Disabled.vue"

```

### 加载中

`loading` 可为布尔值，或 `{ delay, icon }` 对象。

```vue preview src="./demos/Loading.vue"

```

### 幽灵按钮

`ghost` 使背景透明，适合深色或复杂背景。

```vue preview src="./demos/Ghost.vue"

```

### 危险按钮

```vue preview src="./demos/Danger.vue"

```

### Block 按钮

```vue preview src="./demos/Block.vue"

```

### 形状

```vue preview src="./demos/Shape.vue"

```

### 按钮组

```vue preview src="./demos/ButtonGroup.zh.vue"

```

### 图标与徽标

本库扩展：`badge` / `badgeColor`。

```vue preview src="./demos/IconsAndBadge.vue"

```

### 水波纹与按压缩放

本库扩展：`ripple` / `press`。

```vue preview src="./demos/RipplePress.vue"

```

## API

通过属性组合按钮样式，推荐顺序：`type` → `shape` → `size` → `loading` → `disabled`。

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | `'default'` | 语法糖。与 `color`+`variant` 同时存在时以后者为准。 |
| `color` | `'default' \| 'primary' \| 'danger' \| 'success' \| 'info' \| 'warning' \| 'help' \| 'contrast'` | — | 颜色轴。 |
| `variant` | `'solid' \| 'outlined' \| 'dashed' \| 'filled' \| 'text' \| 'link'` | — | 变体轴。 |
| `danger` | `boolean` | `false` | 语法糖，将颜色设为危险色。设置 `color` 时以后者为准。 |
| `ghost` | `boolean` | `false` | 幽灵按钮（透明背景）。对 `text` / `link` 无效。 |
| `shape` | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` | 形状。 |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；可继承 ConfigProvider。 |
| `block` | `boolean` | `false` | 宽度撑满容器。 |
| `loading` | `boolean \| { delay?: number; icon?: IconName \| Component }` | `false` | 加载中；支持延迟与自定义图标。 |
| `disabled` | `boolean` | `false` | 禁用；可继承 ConfigProvider。 |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type。 |
| `href` | `string` | — | 存在时渲染为 `<a>`。 |
| `target` | `string` | — | 链接 target，需配合 `href`。 |
| `label` | `string` | — | 文案；有默认插槽时以插槽为准。 |
| `icon` | `IconName \| Component` | — | 图标名称或组件。 |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | 图标位置。 |
| `iconOnly` | `boolean` | `false` | 强制纯图标方形按钮。 |
| `autoInsertSpace` | `boolean` | `true` | 两个汉字之间插入空格。 |
| `badge` | `string` | — | 徽标文本。 |
| `badgeColor` | `'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'contrast' \| null` | `null` | 徽标语义色。 |
| `ripple` | `boolean` | `false` | 点击水波纹。 |
| `press` | `boolean` | `false` | 按下轻微缩放。 |
| `autofocus` | `boolean` | `false` | 原生 autofocus。 |
| `ariaLabel` | `string` | — | 可访问名称；图标按钮建议提供。 |
| `pt` | `{ root?, icon?, content?, badge? }` | — | 语义结构透传。 |

### Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 点击回调；`loading` / `disabled` 时不触发。 |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容，优先于 `label`。 |
| `icon` | 自定义图标。 |
| `loadingicon` | 自定义加载图标。 |

### 暴露方法

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦根元素。 |
| `ref` | 根 `HTMLButtonElement` 或 `HTMLAnchorElement`。 |

### MButtonGroup Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | 宽度撑满容器。 |
| `ariaLabel` | `string` | — | 组的可访问名称。 |
| `pt` | `{ root? }` | — | 组容器透传。 |

## Semantic DOM

```text
button.m-button / a.m-button
  span.m-button__ripple*        ← ripple 开启时
  span.m-button__icon*          ← 图标 / loading
  span.m-button__label*         ← 文案
  span.m-button__badge*         ← 徽标
```

可用 `pt.root` / `pt.icon` / `pt.content` / `pt.badge` 覆盖各节点属性。

## FAQ

### `type` 和 `color` / `variant` 如何选择？

`type` 本质是一组颜色与变体的映射。两者同时存在时，优先使用 `color` 与 `variant`。

```vue
<MButton type="primary">click</MButton>
```

等同于

```vue
<MButton color="primary" variant="solid">click</MButton>
```

### 按钮与其它组件的颜色词表

Button 使用 `color` / `variant`。Badge、Tag、Alert、Message、Toast 等反馈组件仍使用 `severity`。
