---
title: Result
category: 05 / FEEDBACK
description: 操作结果 / 阻断页：成功、失败、403、404 等。
---

# Result

用于提交成功、失败回执、权限不足或页面不存在等**流程终点**场景。无数据空态请用 [Empty](/components/Empty)。

核心 API：`status` + `size` + `title` / `description`，插槽 `icon` / `default` / `footer`。

## 引入

```ts
import { MResult } from "morya-ui";
```

## 基础用法

`status` 决定默认图标、语义色与 locale 标题。

```vue preview src="./demos/Basic.zh.vue"

```

## 操作区

使用 `#footer` 放置操作按钮；`#default` 可放额外说明内容。

```vue preview src="./demos/Actions.zh.vue"

```

## HTTP 类状态

`403` / `404` / `500` / `418` 默认展示内置插图；传入 `icon` 或 `#icon` 时可改回图标模式。

```vue preview src="./demos/Http.zh.vue"

```

## 尺寸

`size`：`small` / `medium` / `large` / `huge`。

```vue preview src="./demos/Compact.zh.vue"

```

## Props

| 参数          | 类型                                                                                      | 默认值                | 说明                                      |
| ------------- | ----------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- |
| `status`      | `'info' \| 'success' \| 'warning' \| 'error' \| '403' \| '404' \| '500' \| '418'`         | `'info'`              | 结果状态。HTTP 类默认显示内置插图。       |
| `title`       | `string`                                                                                  | 按 `status` 的 locale | 标题。                                    |
| `description` | `string`                                                                                  | —                     | 说明文案。                                |
| `icon`        | [IconName](/docs/types#IconName)                                                          | 按 `status`           | 覆盖默认图标；对 HTTP 状态会切换到图标模式。 |
| `size`        | `'small' \| 'medium' \| 'large' \| 'huge' \| 'sm' \| 'md' \| 'lg'`                        | `'medium'`            | 尺寸。                                    |
| `pt`          | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }`                                | —                     | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Slots

| 插槽名        | 说明                         |
| ------------- | ---------------------------- |
| `icon`        | 自定义图标区。               |
| `title`       | 自定义标题。                 |
| `description` | 自定义说明。                 |
| `default`     | 标题/说明下方的补充内容。    |
| `footer`      | 操作区。                     |

## 无障碍

- 根节点使用 `role="status"`。
- 不要仅靠颜色表达结果；保持标题文案。

## Events

无自定义事件。

## 破坏性变更

- 移除 `presentation` / `illustration` / `image` / `simple`，以及 `warn` / `danger` 别名。
- `#extra` 更名为 `#footer`。
- HTTP 默认视觉改为内置 SVG 插图（不再是巨大状态码数字）。
- 内置插图目录迁至 [Empty](/components/Empty)。
