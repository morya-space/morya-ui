---
title: List
category: 03 / DATA
description: 通用列表，支持 data 驱动、Meta 行、分页与网格布局。
---

# List

用于展示一组同类条目（通知、文章、用户行等）。与 `MDataView` 的分页布局不同，List 聚焦「条目 + Meta + 操作」模式。

## 引入

```ts
import { MList, MListItem, MListItemMeta } from 'morya-ui'
```

## 基础用法

数据主字段为 `items`；`dataSource` / `data` 为兼容别名。使用 `#item="{ item, index }"` 渲染每一行。

```vue preview src="./demos/Basic.vue"
```

## 纵向布局

`itemLayout="vertical"` 适合带 `#extra` 大图或侧栏内容的卡片式列表。

```vue preview src="./demos/Vertical.vue"
```

## Props — List

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | 数据数组（主名称） |
| `dataSource` | `unknown[]` | — | `items` 别名 |
| `data` | `unknown[]` | — | `items` 别名 |
| `bordered` | `boolean` | `false` | 外边框 |
| `split` | `boolean` | `true` | 条目分隔线 |
| `loading` | `boolean` | `false` | `MLoading` 遮罩 |
| `size` | `ListSize` | — | 密度 |
| `itemLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 条目布局 |
| `header` / `footer` | `string` | — | 头尾文案；可用同名插槽 |
| `pagination` | `ListPaginationConfig \| false` | `false` | 分页；内部 `MPagination` |
| `grid` | `ListGridType` | — | CSS Grid 多列 |
| `rowKey` | `string \| (item, index) => string` | — | 稳定 key |
| `pt` | `RootPassThrough` | — | 透传 |

### ListPaginationConfig

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page` | `number` | `1` | 当前页 |
| `pageSize` | `number` | `10` | 每页条数 |
| `total` | `number` | `items.length` | 总数（可大于本地数组，远程分页时不切片） |
| `position` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | 分页位置 |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | 分页对齐 |

### ListGridType

| 字段 | 说明 |
| --- | --- |
| `column` | 默认列数 |
| `gutter` | 间距（数字 px 或 CSS 长度） |
| `xs` / `sm` / `md` / `lg` / `xl` | 断点列数 |

## Props — ListItem

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `actions` | `VNodeChild[]` | 右侧操作；优先 `#actions` |
| `extra` | `VNodeChild` | 额外区域；优先 `#extra` |

## Props — ListItemMeta

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `avatar` | `VNodeChild` | 头像区 |
| `title` | `VNodeChild` | 标题 |
| `description` | `VNodeChild` | 描述 |

## Slots

| 插槽 | 组件 | 说明 |
| --- | --- | --- |
| `default` | List | 无 `items` 时手动 `MListItem` 列表 |
| `item` | List | `{ item, index }` 数据驱动行 |
| `header` / `footer` / `loadMore` | List | 头 / 尾 / 加载更多 |
| `default` / `actions` / `extra` | Item | 主体 / 操作 / 额外 |
| `avatar` / `title` / `description` | Meta | Meta 各区块 |

无数据且非 loading 时展示 `MEmpty`。
