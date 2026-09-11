---
title: API 类型
order: 6
description: 文档 Props 里常见类型名的结构与含义。
---

# API 类型

组件文档 Props 表里出现的类型名，在这里查具体结构。包入口也导出同名类型，可在业务代码里 `import type { … } from 'morya-ui'`（以各组件 `types.ts` 为准）。

<h3 id="PassThroughPart">PassThroughPart</h3>

单个 DOM 节点上要合并的属性 bag。`pt.<part>` 的值就是这个类型。

```ts
type PassThroughPart = Record<string, unknown>
```

常用键：`class`、`style`、`data-*`、`onClick` / `onKeydown`（Vue 事件监听写法）、以及该节点合法的原生 HTML 属性。

<h3 id="RootPassThrough">RootPassThrough</h3>

单根容器（Card、Dialog 遮罩、Tabs 等）：

```ts
type RootPassThrough = {
  root?: PassThroughPart
}
```

<h3 id="ControlPassThrough">ControlPassThrough</h3>

Checkbox / Radio / Switch（可见根是 `<label>`，hidden input 单独一段）：

```ts
type ControlPassThrough = {
  root?: PassThroughPart   // 一般是 label
  input?: PassThroughPart  // 原生 input
}
```

<h3 id="FieldPassThrough">FieldPassThrough</h3>

表单字段（Input、Select、DatePicker 等）：

```ts
type FieldPassThrough = {
  root?: PassThroughPart    // 外层 .m-*-field
  label?: PassThroughPart
  control?: PassThroughPart // 触发器 / 组合控件（Select 等）
  input?: PassThroughPart   // 原生 input / textarea
}
```

具体组件支持哪些键，见该组件文档的 **类型** 或 **pt** 小节。

<h3 id="InputPassThrough">InputPassThrough</h3>

[`Input`](/components/Input) 在 `FieldPassThrough` 基础上多了前后缀等：

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

<h3 id="MSizeInput">MSizeInput</h3>

控件尺寸，多数表单 / 按钮组件的 `size` prop：

```ts
type MSizeInput = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
```

`sm` / `md` / `lg` 为兼容别名；未传时通常继承 [ConfigProvider](/docs/config) 的 `size`。

<h3 id="MInputVariant">MInputVariant</h3>

输入框视觉变体：

```ts
type MInputVariant = 'outlined' | 'filled'
```

<h3 id="ButtonSeverity">ButtonSeverity</h3>

按钮语义色（[`Button`](/components/Button)、Dialog 页脚等）：

```ts
type ButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'   // 'warn' 为别名
  | 'help'
  | 'danger'
  | 'contrast'
```

<h3 id="MAppendTo">MAppendTo</h3>

浮层 Teleport 挂载目标（Dialog、Select 菜单、Toast 等）：

```ts
type MAppendTo = string | HTMLElement | 'self'
```

- `'body'`（默认）：挂到 document.body  
- `'self'`：不 Teleport，就地渲染  
- 也常见 `appendTo: false`（运行时兼容，同 `'self'`）

<h3 id="AsyncGuard">AsyncGuard</h3>

关闭 / 确认前的拦截函数。返回 `false`（含 Promise 解析为 `false`）则**不继续**：

```ts
type AsyncGuard<T extends unknown[] = []> = (
  ...args: T
) => unknown | Promise<unknown>
```

用于 Dialog `beforeClose`、`onPositiveClick`，ConfirmDialog / ConfirmPopup 的 `beforeAccept` 等。

<h3 id="SelectOption">SelectOption</h3>

[`Select`](/components/Select) 选项项：

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

<h3 id="SelectModelValue">SelectModelValue</h3>

```ts
type SelectValue = string | number
type SelectModelValue = SelectValue | SelectValue[] | undefined
```

单选为标量；`multiple` 时为数组。

<h3 id="IconName">IconName</h3>

[`MIcon`](/components/Icon) / [`Button`](/components/Button) 的 `icon` / `name` 使用的注册名，例如 `'search'`、`'chevron-down'`。完整列表见 Icon 文档注册表。

<h3 id="MenuNodeBase">MenuNodeBase</h3>

Menu / Dropdown / ContextMenu 等导航项的公共字段：

```ts
interface MenuNodeBase {
  key?: string
  label?: string
  value?: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  shortcut?: string
  command?: () => void
  items?: MenuNodeBase[]
}
```

<h3 id="MSeverity">MSeverity</h3>

Message、Tag 等的状态色：

```ts
type MSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast'
```

---

更细的组件专属类型（如 `TableServerOptions`、`MenuItem`）写在对应组件页 **类型** 小节；这里只列跨组件复用的名字。
