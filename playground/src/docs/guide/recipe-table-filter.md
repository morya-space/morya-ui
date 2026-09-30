---
title: 表格筛选
order: 21
description: 搜索框 + 角色筛选 + 分页表格的客户端过滤配方。
---

# 表格筛选

列表页常见组合：顶部搜索、下拉筛选、底部分页。本配方用 `MInput` + `MSelect` 驱动 `MTable` 的客户端过滤。

## 目标

- 关键字搜索姓名 / 邮箱（`search-value` + `search-field`）
- 按下角色精确过滤（`filters`）
- 开启 `paginator`，筛选变化时回到第 1 页

## 何时使用

- 后台列表、成员表、本地小数据集的即时过滤
- 服务端分页时，把同样的 UI 事件改成请求参数即可（本页示范客户端）

## 步骤

1. 准备 `columns` / `rows`，并给表格加 `paginator` 与 `v-model:page`。
2. 顶部放 `MInput`（关键字）和可清空的 `MSelect`（角色）。
3. 把关键字绑到 `:search-value`，并用 `:search-field="['name', 'email']"` 限制搜索列。
4. 角色变化时写 `:filters="role ? { role } : null"`；空值传 `null` 表示不过滤。
5. `watch` 搜索/筛选条件，把 `page` 重置为 `1`（表格在改 `search-value` / `filters` 时也会重置，显式写更清晰）。

需要更复杂的比较可用 `filter-options`（`=` / `in` / 自定义 `comparison`）。表头筛选见 [Table](/components/Table) 的「列宽拖拽与表头筛选」。

## 预览

```vue preview src="./demos/recipes/TableFilter.zh.vue"
```

## 检查清单

- [ ] 行数据用 `rows`，列用 `columns`（不要自造 `dataSource`）
- [ ] 搜索字段名与列 `key` 一致
- [ ] `filters` 在「无筛选」时为 `null` / 空对象，避免残留旧条件
- [ ] 开启 `paginator` 并控制 `page` / `rows-per-page`
- [ ] 已引入 `morya-ui` 与样式

## 相关

- [Table](/components/Table)：`search-value`、`filters`、分页
- [Input](/components/Input) / [Select](/components/Select)
- [快速上手](/docs/quick-start)
