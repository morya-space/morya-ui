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
| `ellipsis` | `boolean` | `false` | 单行省略 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Props — Text

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `type` | `TypographyType` | — | 语义色 |
| `code` / `delete` / `mark` / `underline` / `strong` / `italic` / `ellipsis` | `boolean` | `false` | 装饰 |
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
| `pt` | `RootPassThrough` | — | 透传根节点 |

## 类型

### TypographyType

```ts
type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
```
