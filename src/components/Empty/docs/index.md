---
title: Empty
category: 05 / FEEDBACK
description: 空状态：插图 / 图标 + 标题 + 说明 + 操作。
---

# Empty

用于列表无数据、筛选无结果、首次使用等场景。不要用错误色表达正常的无数据状态；接口失败请用 [Result](/components/Result) 或 Message。

默认展示轻量空态图标与 locale `emptyMessage`。内置彩色插图按需加载，通过 `illustration` 显式选用；也可用 `icon`、`image` 或插槽替换视觉。

## 引入

```ts
import { MEmpty } from "morya-ui";
```

## 基础用法

未传 `description` 时使用 locale 的 `emptyMessage`。未传 `icon` / `image` / `illustration` 时使用轻量默认图标（不打包插画 catalog）。

```vue preview src="./demos/Basic.vue"

```

## 操作区

通过 `#extra` 放置恢复动作；默认插槽覆盖说明文案。

```vue preview src="./demos/WithActions.zh.vue"

```

## 无结果

`icon="search"` 或 `illustration="no-result"` 使用搜索空结果插图（按需加载）。

```vue preview src="./demos/NoResult.zh.vue"

```

## 内置插图

空态推荐：`no-content` / `no-result` / `no-message` / `no-schedule` / `no-issue`。仅在传入 `illustration` 时加载对应 SVG。

```vue preview src="./demos/Illustrations.zh.vue"

```

## 紧凑模式

`simple` 为横向紧凑布局，适合表格分组、侧栏等窄区域。

```vue preview src="./demos/Simple.zh.vue"

```

## Props

| 参数               | 类型                                                       | 默认值                | 说明                                                                                                 |
| ------------------ | ---------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| `title`            | `string`                                                   | —                     | 可选标题；传空字符串可隐藏。                                                                         |
| `description`      | `string`                                                   | locale `emptyMessage` | 说明文案；默认插槽可覆盖。                                                                           |
| `showDescription`  | `boolean`                                                  | `true`                | 是否显示说明。                                                                                       |
| `showIcon`         | `boolean`                                                  | `true`                | 是否显示插图 / 图标。                                                                                |
| `illustration`     | `EmptyIllustration`                                        | —                     | 内置插图名；按需加载，优先于默认轻量图标 / `icon="search"` 映射。                                    |
| `icon`             | [IconName](/docs/types#IconName)                           | —                     | 可选图标；未传且无 `image` / 插槽时显示轻量默认图标；`search` 映射 `no-result`。                     |
| `image`            | `string`                                                   | —                     | 插图 URL，优先于 `illustration` / `icon`。                                                           |
| `size`             | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'`  | `'medium'`            | 尺寸。                                                                                               |
| `simple`           | `boolean`                                                  | `false`               | 紧凑横向布局。                                                                                       |
| `pt`               | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —                     | DOM 透传，见 [样式与 attrs](/docs/attrs).                                                            |

## Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `icon`    | 自定义图标区。             |
| `image`   | 自定义插图区。             |
| `title`   | 自定义标题。               |
| `default` | 覆盖说明文案。             |
| `extra`   | 操作区。                   |

## 无障碍

- 根节点使用 `role="status"`。
- 装饰性图标 / 插图使用 `aria-hidden`；操作按钮需有可见文案。

## Events

无自定义事件。
