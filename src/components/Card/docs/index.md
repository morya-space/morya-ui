---
title: Card
category: 03 / DATA
description: 内容容器。通过 title / subtitle 或 header / footer 插槽组织结构。
---

# Card

内容容器，适合分组展示标题、正文与操作。Footer 仅通过插槽扩展（不提供 `footer` prop）。

## 引入

```ts
import { MButton, MCard } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Custom Header

```vue preview src="./demos/CustomHeader.vue"
```

## Cover & Hover

```vue preview src="./demos/CoverAndHover.vue"
```

## Shadow

`shadow` 控制卡片**阴影**出现时机：`never` 平面、`hover` 悬停抬起、`always` 常驻抬起（均使用 `--m-card-shadow-rest`）。

```vue preview src="./demos/Shadow.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题。 |
| `subtitle` | `string` | — | 副标题。 |
| `ariaLabel` | `string` | — | 可访问名称；默认回退到 `title`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 内边距尺寸。 |
| `bordered` | `boolean` | `true` | 是否描边。 |
| `shadow` | `'never' \| 'hover' \| 'always'` | `'never'` | 阴影时机：`never` 无阴影；`hover` / `always` 均使用 `--m-card-shadow-rest`（`hover` 仅悬停时出现）。 |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | 标题 heading 级别。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | 根节点透传，键名 `root`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 正文。 |
| `header` | 自定义头部（优先于 `title` / `subtitle`）。 |
| `footer` | 底部区域（推荐用插槽，无 footer prop）。 |
| `cover` | 封面，渲染在头部上方。 |

## 无障碍

- 有 `title` 时默认作为容器 `aria-label`；复杂头部请用 `#header` 并保证标题可读。
- 底部操作按钮应使用语义清晰的 `label` 文本。

## Events

无自定义事件。
