---
title: Typography
category: 01 / PRIMITIVE
description: Typography primitives — title, text, paragraph, and link.
---

# Typography

Typography primitives for headings, body text, and links. Semantic tags: `MTitle` → `h1`–`h5`, `MText` → `span`, `MParagraph` → `p`, `MLink` → `a`. Use `MTypography` as an article wrapper, or compound access via `MTypography.Title` and siblings.

## Import

```ts
import { MTypography, MTitle, MText, MParagraph, MLink } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props — Title

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `1` | Heading level → `h1`–`h5` |
| `type` | `TypographyType` | — | Semantic tone |
| `code` | `boolean` | `false` | Code style |
| `delete` | `boolean` | `false` | Strikethrough |
| `mark` | `boolean` | `false` | Highlight |
| `underline` | `boolean` | `false` | Underline |
| `strong` | `boolean` | `false` | Bold |
| `italic` | `boolean` | `false` | Italic |
| `ellipsis` | `boolean` | `false` | Single-line ellipsis |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Props — Text

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `TypographyType` | — | Semantic tone |
| `code` / `delete` / `mark` / `underline` / `strong` / `italic` / `ellipsis` | `boolean` | `false` | Decorations |
| `disabled` | `boolean` | `false` | Disabled |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Props — Paragraph

Same as Text, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `spacing` | `boolean` | `true` | Bottom margin |

## Props — Link

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | URL |
| `target` | `string` | — | Open target |
| `type` | `TypographyType` | — | Semantic tone |
| `underline` | `boolean` | `true` | Underline |
| `disabled` | `boolean` | `false` | Disabled (blocks navigation) |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Types

### TypographyType

```ts
type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
```
