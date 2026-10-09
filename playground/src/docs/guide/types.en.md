---
title: API types
order: 8
description: Shapes behind type names in component Props tables.
---

# API types

Look up structures for names that appear in Props tables. The package re-exports the same names as TypeScript types (`import type { … } from 'morya-ui'`), per component `types.ts`.

<h3 id="PassThroughPart">PassThroughPart</h3>

Attribute bag merged onto one DOM node—the value of `pt.<part>`.

```ts
type PassThroughPart = Record<string, unknown>
```

Common keys: `class`, `style`, `data-*`, `onClick` / `onKeydown`, and valid native attributes for that element.

<h3 id="RootPassThrough">RootPassThrough</h3>

Single-root containers (Card, Dialog backdrop, Tabs, …):

```ts
interface RootPassThrough {
  root?: PassThroughPart
}
```

<h3 id="ControlPassThrough">ControlPassThrough</h3>

Checkbox / Radio / Switch (visible `<label>` root + hidden input):

```ts
interface ControlPassThrough {
  root?: PassThroughPart   // usually the label
  input?: PassThroughPart  // native input
}
```

<h3 id="FieldPassThrough">FieldPassThrough</h3>

Form fields (Input, Select, DatePicker, …):

```ts
interface FieldPassThrough {
  root?: PassThroughPart    // outer .m-*-field
  label?: PassThroughPart
  control?: PassThroughPart // trigger / composite control
  input?: PassThroughPart   // native input / textarea
}
```

Which keys a component accepts is listed on that component’s **Types** or **pt** section.

<h3 id="InputPassThrough">InputPassThrough</h3>

[`Input`](/components/Input) extends `FieldPassThrough` with affixes:

```ts
type InputPassThrough = FieldPassThrough & {
  prefix?: PassThroughPart
  suffix?: PassThroughPart
  help?: PassThroughPart
  count?: PassThroughPart
}
```

<h3 id="SplitterPassThrough">SplitterPassThrough</h3>

[`Splitter`](/components/Splitter) extends `RootPassThrough` with gutter and panes:

```ts
type SplitterPassThrough = RootPassThrough & {
  gutter?: PassThroughPart
  panel1?: PassThroughPart
  panel2?: PassThroughPart
}
```

Gutter look can also use `resizeTriggerClass` / `resizeTriggerStyle`; content goes in `#resize-trigger` (alias `#gutter`).

<h3 id="MSizeInput">MSizeInput</h3>

Control size for many form / button props:

```ts
type MSizeInput = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
```

`sm` / `md` / `lg` are legacy aliases. Omitted `size` usually inherits [ConfigProvider](/docs/config).

<h3 id="MInputVariant">MInputVariant</h3>

```ts
type MInputVariant = 'outlined' | 'filled'
```

<h3 id="ButtonType">ButtonType</h3>

Button type sugar ([`Button`](/components/Button)):

```ts
type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text'
```

<h3 id="ButtonColor">ButtonColor</h3>

Button color axis (Button, ConfirmDialog `acceptColor`, Dialog `positiveColor`, …):

```ts
type ButtonColor =
  | 'default'
  | 'primary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'contrast'
  | 'link'
```

<h3 id="ButtonVariant">ButtonVariant</h3>

Button variant axis:

```ts
type ButtonVariant = 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link'
```

<h3 id="MAppendTo">MAppendTo</h3>

Overlay Teleport target:

```ts
type MAppendTo = string | HTMLElement | 'self'
```

- `'body'` (default)  
- `'self'` — render in place (no Teleport)  
- `false` is accepted at runtime (same idea as `'self'`)

<h3 id="AsyncGuard">AsyncGuard</h3>

Guard before close / confirm. Return `false` (including from a Promise) to **abort**:

```ts
type AsyncGuard<T extends unknown[] = []> = (
  ...args: T
) => unknown | Promise<unknown>
```

Used by Dialog `beforeClose`, ConfirmDialog `beforeAccept`, and similar.

<h3 id="SelectOption">SelectOption</h3>

[`Select`](/components/Select) option row:

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

<h3 id="SelectOptionGroup">SelectOptionGroup</h3>

[`Select`](/components/Select) option group (mix into `options` to render a group header row):

```ts
interface SelectOptionGroup {
  label: string
  items: SelectOption[]
}
```

<h3 id="SelectModelValue">SelectModelValue</h3>

```ts
type SelectValue = string | number
type SelectModelValue = SelectValue | SelectValue[] | undefined
```

Scalar when single-select; array when `multiple`.

<h3 id="IconName">IconName</h3>

Registered icon id for [`MIcon`](/components/Icon) / [`Button`](/components/Button), e.g. `'search'`. See the Icon registry.

<h3 id="MenuNodeBase">MenuNodeBase</h3>

Shared fields for Menu / Dropdown / ContextMenu items:

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

<h3 id="MToneType">MToneType</h3>

Base semantic tones for display / feedback components:

```ts
type MToneType =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'danger'
  | 'contrast'
```

<h3 id="MTagType">MTagType</h3>

Tag / Badge / Chip / Status: `MToneType` plus brand `primary`.

```ts
type MTagType = MToneType | 'primary'
```

<h3 id="MToastType">MToastType</h3>

Message / Toast / Timeline tones:

```ts
type MToastType =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'secondary'
  | 'contrast'
```

---

Component-only types (`TableServerOptions`, `MenuItem`, …) live under each component’s **Types** section; this page is for shared names only.
