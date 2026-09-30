---
title: Admin layout
order: 23
description: Assemble a collapsible-sider admin chrome with the MLayout family.
---

# Admin layout

Typical admin chrome: brand header, collapsible sider nav, and a main content region. This recipe combines `MLayout*` with `MMenu` into a copy-ready shell.

## Goal

- Header for brand / actions, sider for nav, content for the route outlet
- Keep `v-model:collapsed` in sync with `MMenu`
- Fixed height in docs preview; `100dvh` / `fill-viewport` in real apps

## When to use

- Consoles, ops dashboards, and SaaS workspaces that need a fixed shell
- Route pages should fill content only—no duplicated sider markup

Login and marketing pages usually keep a separate shell—skip this recipe there.

## Steps

1. Import `MLayout`, `MLayoutHeader`, `MLayoutSider`, and `MLayoutContent` (optional `MLayoutFooter`).
2. Give the root layout an explicit height (`fill-viewport` / `100dvh` in apps; a fixed `rem` in docs).
3. Set `has-sider` on the `MLayout` that **directly** wraps `MLayoutSider`.
4. Wire `v-model:collapsed`, `show-trigger`, and `collapse-mode="width"`, and pass the same `collapsed` into `MMenu`.
5. Put the page outlet in `MLayoutContent` (`embedded` optional); swap the preview placeholder for `<RouterView />`.

For embedding in a relatively positioned host, use root `position="absolute"` (parent must have a height)—see Absolute Shell on [Layout](/components/Layout).

## Preview

```vue preview src="./demos/recipes/AdminChrome.en.vue"

```

## Checklist

- [ ] `has-sider` is on the `MLayout` that directly wraps the sider
- [ ] Root layout has an explicit height so Content can stretch
- [ ] `MLayoutSider` and `MMenu` share the same collapsed state
- [ ] Long content scrolls inside Content (`overflow: auto` or nested `MScrollbar`)
- [ ] `morya-ui` and styles are imported

## Related

- [Layout](/components/Layout) · [Menu](/components/Menu)
- [Layout guide](/docs/design-layout) · [Spacing](/docs/design-spacing)
- [Theme customize](/docs/recipe-theme-customize)
