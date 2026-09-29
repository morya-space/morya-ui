---
title: Common Props
order: 7.5
description: Shared props, Semantic DOM, and pt conventions across components.
---

# Common Props

Most Morya components share one interaction vocabulary and style targeting model. This page is the morya counterpart to **antd Common Props / Semantic DOM**, using morya names. Cross-links: [Conventions](/docs/conventions), [Attrs](/docs/attrs), [API types](/docs/types), [Design tokens](/docs/design-tokens).

## Semantics and appearance

| Prop | Meaning | Common values |
| --- | --- | --- |
| `severity` | Semantic color | `primary` (often omitted) / `secondary` / `success` / `info` / `warning` (`warn`) / `help` / `danger` / `contrast` |
| `variant` | Appearance shortcut | Per component: `outlined` / `dashed` / `text` / `link` / `ghost` / `quaternary` / input `filled`, etc. |
| `size` | Control size | `small` / `medium` / `large` (`sm` / `md` / `lg` aliases); often inherits Config when omitted |
| `disabled` | Disabled | Blocks interaction; visuals use `--m-opacity-disabled` and related tokens |
| `loading` | Busy | Common on Button; prevents double submit |
| `fluid` | Full width | Stretch to parent width |
| `status` / `invalid` | Form validation | e.g. `error` / `warning`; pair with `error-message` |

Boolean mirrors (`outlined`, `text`, `link`, …) may equal `variant`—pick one. **`severity` colors; `variant` shapes**; they compose (e.g. `severity="danger"` + `outlined`).

## Where class / style / events land

Composite components are not “root = native control”. Three targeting patterns:

| Kind | Examples | `class` / `style` / most attrs | Events `@xxx` |
| --- | --- | --- | --- |
| Field | Input, Select | Outer field root | Inner input / control |
| Label control | Checkbox, Switch | Visible `<label>` | Hidden `<input>` |
| Container | Card, Tabs | Public root (Dialog `class` on scrim) | Same layer |
| Leaf | Button, Tag | Interactive element itself | Same element |

Full rules and demos: [Attrs](/docs/attrs).

## Semantic DOM and `pt`

**Semantic DOM**: stable structural names in docs for customizable nodes (e.g. Button root / icon / label)—handy for theming and tests.

**`pt` (pass-through)**: merge `class` / `style` / native attrs onto inner DOM by segment key.

```vue
<MInput
  label="API Key"
  :pt="{
    root: { class: 'col-span-2' },
    input: { class: 'font-mono', autocomplete: 'off' },
  }"
/>
```

Common keys:

| Shape | `pt` keys |
| --- | --- |
| Field | `root`, `label`, `input` / `control`; sometimes `prefix` / `suffix` / `help` |
| Checkbox-like | `root`, `input` |
| Single-root container | `root` |
| Complex | Extra keys in that component’s docs (e.g. Splitter `gutter`) |

Types: `PassThroughPart`, `FieldPassThrough`, `RootPassThrough`, … in [API types](/docs/types). Same-named `class` / `style` **merge** with existing bindings rather than replace wholesale.

Leaf components such as `MButton` bind `class` on the `<button>` directly; groups like `MButtonGroup` still accept `pt.root`. Structure notes live under each component’s **Semantic DOM** section (example: [Button](/components/Button)).

## Global defaults

`MConfigProvider` / `createMoryaUI` can supply default `size`, `density`, `inputVariant`, `appendTo`, `zIndex`, `locale`, `componentDefaults`, `motion`, and more — see [Configuration](/docs/config). Visual layer remains [Theme](/docs/theme) via `useTheme` / token overrides.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep one `severity` vocabulary across components | Mix foreign names like `type="danger"` in the same product |
| Put layout `class` on the field root | Expect `class` to fall through onto the inner input |
| Use `pt` for prefix / inner tweaks | Fork a component to change one class |
| Align Semantic DOM names with BEM (`.m-button__label`) | Invent undocumented `pt` keys |
