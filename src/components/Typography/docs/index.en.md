---
title: Typography
category: 01 / PRIMITIVE
description: Typography primitives — title, text, paragraph, and link.
---

# Typography

Typography primitives for headings, body text, and links. Semantic tags: `MTitle` → `h1`–`h5`, `MText` → `span`, `MParagraph` → `p`, `MLink` → `a`. Use `MTypography` as an article wrapper, or compound access via `MTypography.Title` and siblings.


## When to use

- Typography primitives — title, text, paragraph, and link

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
| `ellipsis` | `TypographyEllipsis` | `false` | Single-line / multi-line / expandable ellipsis |
| `copyable` | `TypographyCopyable` | `false` | Copy affordance |
| `editable` | `TypographyEditable` | `false` | Inline editing |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Props — Text

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `TypographyType` | — | Semantic tone |
| `code` / `delete` / `mark` / `underline` / `strong` / `italic` | `boolean` | `false` | Decorations |
| `ellipsis` | `TypographyEllipsis` | `false` | Single-line / multi-line / expandable ellipsis |
| `copyable` | `TypographyCopyable` | `false` | Copy affordance |
| `editable` | `TypographyEditable` | `false` | Inline editing |
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
| `copyable` | `TypographyCopyable` | `false` | Copy affordance |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Behaviour

### Ellipsis

`ellipsis` as `true` clamps a single line; an object enables multi-line clamping with expand/collapse:

```vue
<MParagraph :ellipsis="{ rows: 3, expandable: true, tooltip: 'Full text', suffix: '…' }" />
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `number` | `1` | Visible lines |
| `expandable` | `boolean` | `false` | Show an expand/collapse control (only when `rows > 1`) |
| `tooltip` | `string` | — | Native `title` hint |
| `suffix` | `string` | — | Trailing text appended while collapsed |

### Copyable

`copyable` as `true` copies the rendered text; an object customizes the source, formatting and callback:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Text to copy; defaults to the rendered content |
| `tooltips` | `[string, string]` | — | `[copy, copied]` labels |
| `format` | `(text: string) => string` | — | Transform before writing to the clipboard |
| `onCopy` | `(text: string) => void` | — | Called after a successful copy |

### Editable

`editable` as `true` adds an edit affordance; an object controls the initial state and commit behaviour. `Enter` or blur commits, `Escape` cancels.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `editing` | `boolean` | `false` | Start in editing mode |
| `maxLength` | `number` | — | Maximum length |
| `autoSize` | `boolean \| { minRows?, maxRows? }` | — | Auto-growing multi-line editor |
| `tooltip` | `string` | — | Label for the edit affordance |
| `onChange` | `(text: string) => void \| boolean \| string` | — | Commit callback; return `false` to reject, or a string to show it as an error |

## Types

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
