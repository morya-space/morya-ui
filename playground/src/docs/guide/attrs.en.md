---
title: Styling & attrs
order: 7
description: Where class, style, events, and pt land on each component.
---

# Styling & attrs

Before you pass `class`, `style`, or `@keydown` to a component, know which DOM node receives it. Compound fields (especially form controls) are not a single native element—they wrap labels, help text, affixes, and more.

The rules below are the library-wide contract. Each component’s `pt` prop targets inner parts; see that component’s API for allowed keys.

## Three fallthrough patterns

| Pattern | Examples | Fallthrough attrs (except control events) | `@xxx` events | Common native attrs |
| --- | --- | --- | --- | --- |
| **Field** | Input, Select, DatePicker | Outer field root (`.m-input-field`, etc.) | Native input / textarea / control | Use props: `placeholder`, `name`, … |
| **Label control** | Checkbox, Radio, Switch | Visible `<label>` root | Hidden `<input>` | `name`, `value` as props |
| **Container** | Card, Dialog, Tabs, Table | Component root element | Same root | Inner nodes via `pt` |
| **Leaf** | Button, Icon, Tag | The interactive element itself | Same element | Same as a plain Vue component |

**Field / label controls:** every fallthrough attr except **event listeners** bound to the native control (`@keydown`, `@paste`, …) goes on the **root** (`class`, `style`, `data-*`, `title`, `tabindex`, undeclared `aria-*`, etc.). Prefer props for common semantics; use `pt` to target inner DOM.

Leaf components behave like you expect. For fields: events on the control, everything else on the wrapper root.

## Field components

Input is roughly:

```text
div.m-input-field          ← class / style / data-* / title / tabindex … go here
  label
  div.m-input-field__control
    input                    ← @keydown, @focus, etc. go here
  span.m-input-field__help
```

Example:

```vue preview src="./demos/attrs/FieldComponents.en.vue"
```

Use **props** for `placeholder`, `name`, `autocomplete`, and `autofocus` (typed and documented). Undeclared attrs of the same names fall through to the field root, not the input—use `pt.input` when you need them on the control.

The same split applies to Select, DatePicker, InputNumber, and similar fields.

## Label controls

For Checkbox / Radio / Switch, `class` lands on the `<label>`; change/input events are wired on the inner input.

```vue preview src="./demos/attrs/LabelControls.vue"
```

## Containers

Card, Panel, Tabs, Table: `class` on the outer root, as you would expect.

Dialog and Drawer Teleport to `body`. `class` / `style` apply to the **backdrop** layer, not the inner `.m-dialog` panel—so you can style the full-screen overlay without fighting panel layout.

```vue preview src="./demos/attrs/Containers.vue"
```

## Pass-through (`pt`)

Use `pt` when you need a specific inner node—extra classes, styles, `data-*`, or native attributes:

```vue
<MInput
  label="API Key"
  pt={{
    root: { class: 'col-span-2' },
    input: { class: 'font-mono', autocomplete: 'off' },
    prefix: { class: 'text-muted' },
  }}
/>
```

Typical keys:

| Shape | `pt` keys |
| --- | --- |
| Fields (Input, Textarea, Select, …) | `root`, `input` or `control`, `label`; some add `prefix` / `suffix` / `help` |
| Checkbox / Radio / Switch | `root`, `input` |
| Single-root containers | `root` |

`class` and `style` in `pt` merge with existing bindings on that node; they do not replace the whole attribute object.

For full shapes of `FieldPassThrough`, `RootPassThrough`, and similar names in Props tables, see [API types](/docs/types).

## Where layout classes land

Field components keep layout `class` / `style` on the outer root so labels and help text stay aligned with the control width. Put layout classes on the component tag; you usually do not need to rebind them onto the inner input.

## See also

- [Input](/components/Input): full field example
- [Checkbox](/components/Checkbox): label control
- [Card](/components/Card), [Dialog](/components/Dialog): containers
