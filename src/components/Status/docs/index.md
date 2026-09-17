---
title: Status
category: 01 / DATA
description: 行内状态标识：圆点 / 语义图标 + 文案。
---

# Status

用于表格、详情标题旁等场景，以彩色标识 + 文案展示业务状态。比 [Tag](/components/Tag) 更轻；需要分类标签或可关闭时用 Tag。

语义色（非 `secondary` / `contrast`）默认带对应图标，避免「纯色文字」难以扫读。

## 引入

```ts
import { MStatus } from "morya-ui";
```

## 基础用法

通过 `label` 或默认插槽展示文案。中性态用圆点；成功 / 失败等自动显示图标。

```vue preview src="./demos/Basic.vue"

```

## Severity

使用 `severity` 定义语义色；默认 `secondary`（圆点、中性）。

```vue preview src="./demos/Severity.vue"

```

## Size & Processing

`size` 支持 `small` / `large`；`processing` 为标识脉冲动画。

```vue preview src="./demos/Processing.vue"

```

## 标签 · 纯文字 · 自定义图标

- `variant="tag"`：柔和胶囊底 + 圆点 / 自动图标。
- `variant="text"`：仅文案，无标识、无自动图标。
- `icon` / `#icon`：覆盖自动图标。
- `disabled`：弱化禁用态。

```vue preview src="./demos/Variants.vue"

```

## Props

| 参数         | 类型                                                                                                         | 默认值        | 说明                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------------ |
| `label`      | `string`                                                                                                     | —             | 状态文案。存在默认插槽内容时以插槽为准。                     |
| `severity`   | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'secondary'` | 语义色。非中性态默认带图标。                                 |
| `processing` | `boolean`                                                                                                    | `false`       | 标识脉冲动画。                                               |
| `size`       | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'`                                                                 | —             | 尺寸。                                                       |
| `color`      | `string`                                                                                                     | —             | 自定义颜色，覆盖 `severity`。                                |
| `variant`    | `'dot' \| 'tag' \| 'text'`                                                                                   | `'dot'`       | 展示形态：圆点/图标 / 胶囊 / 纯文字。                        |
| `icon`       | [IconName](/docs/types#IconName)                                                                             | —             | 前导图标；覆盖自动图标。                                     |
| `disabled`   | `boolean`                                                                                                    | `false`       | 禁用弱化样式。                                               |

## Slots

| 插槽名    | 说明             |
| --------- | ---------------- |
| `default` | 状态文案。       |
| `icon`    | 自定义前导图标。 |

## 无障碍

- 根节点使用 `role="status"`。
- 不要仅靠颜色区分状态；保持可见文案。

## Events

无自定义事件。
