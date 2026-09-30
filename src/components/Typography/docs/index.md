---
title: Typography
category: 01 / PRIMITIVE
description: 排版原语：标题、正文、段落与链接。
---

# Typography

文字排版原语。语义标签：`MTitle` → `h1`–`h5`，`MText` → `span`，`MParagraph` → `p`，`MLink` → `a`。可用 `MTypography` 作为文章容器，或通过 `MTypography.Title` 等复合写法引用子组件。

## 引入

```ts
import { MTypography, MTitle, MText, MParagraph, MLink } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Props — Title

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `1` | 标题级别 → `h1`–`h5` |
| `type` | `TypographyType` | — | 语义色 |
| `code` | `boolean` | `false` | 代码样式 |
| `delete` | `boolean` | `false` | 删除线 |
| `mark` | `boolean` | `false` | 高亮 |
| `underline` | `boolean` | `false` | 下划线 |
| `strong` | `boolean` | `false` | 加粗 |
| `italic` | `boolean` | `false` | 斜体 |
| `ellipsis` | `TypographyEllipsis` | `false` | 省略：单行 / 多行 / 可展开 |
| `copyable` | `TypographyCopyable` | `false` | 复制按钮 |
| `editable` | `TypographyEditable` | `false` | 行内编辑 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Props — Text

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `type` | `TypographyType` | — | 语义色 |
| `code` / `delete` / `mark` / `underline` / `strong` / `italic` | `boolean` | `false` | 装饰 |
| `ellipsis` | `TypographyEllipsis` | `false` | 省略：单行 / 多行 / 可展开 |
| `copyable` | `TypographyCopyable` | `false` | 复制按钮 |
| `editable` | `TypographyEditable` | `false` | 行内编辑 |
| `disabled` | `boolean` | `false` | 禁用态 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Props — Paragraph

同 Text，另加：

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spacing` | `boolean` | `true` | 段落下边距 |

## Props — Link

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | — | 链接地址 |
| `target` | `string` | — | 打开方式 |
| `type` | `TypographyType` | — | 语义色 |
| `underline` | `boolean` | `true` | 下划线 |
| `disabled` | `boolean` | `false` | 禁用（阻止跳转） |
| `copyable` | `TypographyCopyable` | `false` | 复制按钮 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 文字内容。 |

## 行为

### 省略

`ellipsis` 传 `true` 时为单行省略；传对象可开启多行省略与展开/收起：

```vue
<MParagraph :ellipsis="{ rows: 3, expandable: true, tooltip: '完整内容', suffix: '…' }" />
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `rows` | `number` | `1` | 可见行数 |
| `expandable` | `boolean` | `false` | 显示展开/收起控件（仅 `rows > 1` 生效） |
| `tooltip` | `string` | — | 原生 `title` 提示 |
| `suffix` | `string` | — | 收起时追加的尾串 |

### 复制

`copyable` 传 `true` 时复制渲染出的文本；传对象可指定文本、格式化与回调：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 复制的文本，默认为渲染内容 |
| `tooltips` | `[string, string]` | — | `[复制, 已复制]` 提示文案 |
| `format` | `(text: string) => string` | — | 写入剪贴板前转换 |
| `onCopy` | `(text: string) => void` | — | 复制成功后回调 |

### 行内编辑

`editable` 传 `true` 时提供编辑入口；传对象可控制初始状态与提交行为。回车或失焦提交，`Esc` 取消。

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `editing` | `boolean` | `false` | 初始即处于编辑态 |
| `maxLength` | `number` | — | 最大长度 |
| `autoSize` | `boolean \| { minRows?, maxRows? }` | — | 自适应高度的多行编辑 |
| `tooltip` | `string` | — | 编辑入口提示 |
| `onChange` | `(text: string) => void \| boolean \| string` | — | 提交回调；返回 `false` 拒绝改动，返回字符串则展示为错误 |

## 类型

### TypographyType

```ts
type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
```

### TypographyEllipsis

```ts
interface TypographyEllipsisConfig {
  rows?: number
  expandable?: boolean
  tooltip?: string
  suffix?: string
}

type TypographyEllipsis = boolean | TypographyEllipsisConfig
```

### TypographyCopyable

```ts
interface TypographyCopyableConfig {
  text?: string
  tooltips?: [string, string]
  onCopy?: (text: string) => void
  format?: (text: string) => string
}

type TypographyCopyable = boolean | TypographyCopyableConfig
```

### TypographyEditable

```ts
interface TypographyEditableConfig {
  editing?: boolean
  maxLength?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  tooltip?: string
  onChange?: (text: string) => void | boolean | string
}

type TypographyEditable = boolean | TypographyEditableConfig
```
