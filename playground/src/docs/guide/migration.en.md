---
title: API migration
order: 7
description: Deprecated props and recommended replacements.
---

# API migration

Some components keep early prop names so existing apps keep working. Prefer the **recommended** API in new code.

Deprecated aliases **still work** in the current release; they may be removed in a future major version.

## Mapping

| Component | Legacy | Preferred | Notes |
| --- | --- | --- | --- |
| `WiInput` | `error` | `invalid` | Marks validation failure |
| `WiTextarea` | `error` | `invalid` | Same as Input |
| `WiSelect` | `error` | `invalid` | Same as Input |
| `WiTextarea` | `autoResize` | `autosize` | Boolean `true` or `{ minRows, maxRows }` |
| `WiButton` | `block` | `fluid` | Full container width |
| `WiDivider` | `orientation` | `layout` | `horizontal` / `vertical` |

`errorMessage` is **not** deprecated. It shows error copy and implies invalid when set.

## Form invalid state

`Input`, `Textarea`, and `Select` share the same invalid rules:

```vue
<!-- Legacy (still supported) -->
<WiInput v-model="email" error error-message="Invalid format" />

<!-- Preferred -->
<WiInput v-model="email" invalid error-message="Invalid format" />
```

You can rely on `error-message` alone:

```vue
<WiInput v-model="email" error-message="Required" />
```

## Textarea autosize

```vue
<!-- Legacy -->
<WiTextarea v-model="note" auto-resize />

<!-- Preferred: grow without cap -->
<WiTextarea v-model="note" :autosize="true" />

<!-- Preferred: clamp rows -->
<WiTextarea v-model="note" :autosize="{ minRows: 2, maxRows: 6 }" />
```

## Full-width button

```vue
<!-- Legacy -->
<WiButton label="Submit" block />

<!-- Preferred -->
<WiButton label="Submit" fluid />
```

## Divider layout

```vue
<!-- Legacy -->
<WiDivider orientation="vertical" />

<!-- Preferred -->
<WiDivider layout="vertical" />
```

## Custom CSS

During the transition, some components apply both `--invalid` and `--error` modifiers when invalid. Prefer `--invalid` in new styles:

```css
/* Preferred */
.wi-input--invalid { /* … */ }

/* Still works; migrate when convenient */
.wi-input--error { /* … */ }
```

`WiSelect` currently exposes `wi-select--error` only; `--invalid` alignment is planned.

## See also

- [Configuration](/docs/config): size, density, locale
- [Components](/components): up-to-date prop tables
