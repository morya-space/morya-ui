---
title: Common Props
order: 7.5
description: 跨组件公共 props、Semantic DOM 与 pt 约定。
---

# Common Props

多数 Morya 组件共享同一套交互词表与样式落点，本页说明 morya 自己的命名与语义。细节交叉阅读：[约定](/docs/conventions)、[样式与 attrs](/docs/attrs)、[API 类型](/docs/types)、[设计令牌](/docs/design-tokens)。

## 语义与外观

| Prop                 | 含义         | 常见取值                                                                                                      |
| -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `severity`           | 语义色       | `primary`（常可省略）/ `secondary` / `success` / `info` / `warning`（`warn`）/ `help` / `danger` / `contrast` |
| `variant`            | 外观快捷方式 | 随组件：`outlined` / `dashed` / `text` / `link` / `ghost` / `quaternary` / 输入框 `filled` 等                 |
| `size`               | 控件尺寸     | `small` / `medium` / `large`（兼容 `sm` / `md` / `lg`）；未传常继承 Config                                    |
| `disabled`           | 禁用         | 交互与点击关闭；视觉用 `--m-opacity-disabled` 等                                                              |
| `loading`            | 加载中       | 常见于 Button；阻止重复提交                                                                                   |
| `fluid`              | 通栏         | 宽度撑满父级                                                                                                  |
| `status` / `invalid` | 表单校验态   | 如 `error` / `warning`；配合 `error-message`                                                                  |

布尔形态（`outlined`、`text`、`link`…）与 `variant` 等价时可择一；**severity 管色，variant 管形**，可组合（如 `severity="danger"` + `outlined`）。

## 样式落点：class / style / 事件

复合组件不是「根 = 原生控件」。attrs 三类落点：

| 类型       | 例子             | `class` / `style` / 多数 attrs   | 事件 `@xxx`       |
| ---------- | ---------------- | -------------------------------- | ----------------- |
| 字段       | Input、Select    | 外层 field 根                    | 内层 input / 控件 |
| Label 控件 | Checkbox、Switch | 可见 `<label>`                   | hidden `<input>`  |
| 容器       | Card、Tabs       | 对外根（Dialog 的 class 在遮罩） | 同层              |
| 叶子       | Button、Tag      | 交互元素本身                     | 同元素            |

完整规则与演示：[样式与 attrs](/docs/attrs)。

## Semantic DOM 与 `pt`

**Semantic DOM**：文档里用稳定的结构名描述可定制节点（如 Button 的 root / icon / label），方便主题与测试定位。

**`pt`（pass-through）**：按分段把 `class` / `style` / 原生属性合并到内层 DOM，键名即分段名。

```vue
<MInput
  label="API Key"
  :pt="{
    root: { class: 'col-span-2' },
    input: { class: 'font-mono', autocomplete: 'off' },
  }"
/>
```

常见键：

| 形态        | `pt` 键                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| 字段        | `root`、`label`、`input` / `control`，部分有 `prefix` / `suffix` / `help` |
| Checkbox 等 | `root`、`input`                                                           |
| 单根容器    | `root`                                                                    |
| 复杂组件    | 额外键见该组件文档（如 Splitter 的 `gutter`）                             |

类型：`PassThroughPart`、`FieldPassThrough`、`RootPassThrough` 等见 [API 类型](/docs/types)。同名 `class` / `style` 与已有绑定**合并**，非整段覆盖。

叶子组件（如 `MButton`）通常直接把 `class` 绑在 `<button>` 上；`MButtonGroup` 等仍可用 `pt.root`。结构说明写在各组件 **Semantic DOM** 小节（示范：[Button](/components/Button)）。

## 全局默认

`MConfigProvider` / `createMoryaUI` 可下发默认 `size`、`density`、`inputVariant`、`appendTo`、`zIndex`、`locale`、`componentDefaults`、`motion` 等——见 [全局配置](/docs/config)。视觉层仍用 [主题](/docs/theme) 的 `useTheme` / 令牌覆盖。

## 建议与避免

| 建议                                                  | 避免                                  |
| ----------------------------------------------------- | ------------------------------------- |
| 跨组件统一 `severity` 词表                            | 同一产品里混用 `type="danger"` 等异名 |
| 布局 class 加在字段根                                 | 指望 `class` 自动落到内层 input       |
| 用 `pt` 改前缀 / 控件细节                             | 为改一处 class 去 fork 组件           |
| Semantic DOM 名称与 BEM（`.m-button__label`）对齐记忆 | 臆造未文档化的 `pt` 键                |
