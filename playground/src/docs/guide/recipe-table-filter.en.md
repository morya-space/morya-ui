---
title: Table filter
order: 21
description: Client-side table filtering with search, role select, and pagination.
---

# Table filter

A common list page combo: search box, dropdown filter, and paginator. This recipe drives `MTable` client filtering from `MInput` + `MSelect`.

## Goal

- Keyword search on name / email (`search-value` + `search-field`)
- Exact role filter (`filters`)
- Enable `paginator` and reset to page 1 when filters change

## When to use

- Admin lists, member tables, and small local datasets with instant filtering
- For server-side pagination, keep the same UI and turn the events into request params (this page shows the client path)

## Steps

1. Define `columns` / `rows`, then enable `paginator` with `v-model:page`.
2. Put `MInput` (keyword) and a clearable `MSelect` (role) above the table.
3. Bind the keyword to `:search-value` and limit columns with `:search-field="['name', 'email']"`.
4. When role changes, pass `:filters="role ? { role } : null"`. Use `null` for “no filter”.
5. `watch` search/filter state and reset `page` to `1` (the table also resets on `search-value` / `filters` changes; being explicit is clearer).

For richer comparisons, use `filter-options` (`=` / `in` / custom `comparison`). Header filters are covered in [Table](/components/Table) under column resize / header filters.

## Preview

```vue preview src="./demos/recipes/TableFilter.en.vue"
```

## Checklist

- [ ] Rows go through `rows`, columns through `columns` (do not invent a `dataSource`)
- [ ] Search field names match column `key`s
- [ ] `filters` is `null` / empty when inactive so stale criteria do not linger
- [ ] `paginator` is on and `page` / `rows-per-page` are controlled
- [ ] `morya-ui` and styles are imported

## Related

- [Table](/components/Table): `search-value`, `filters`, pagination
- [Input](/components/Input) / [Select](/components/Select)
- [Quick start](/docs/quick-start)
