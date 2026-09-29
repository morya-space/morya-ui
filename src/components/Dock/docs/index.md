---
title: Dock
category: 04 / NAVIGATION
description: macOS 风格图标坞。
---

# Dock

以图标列表展示快捷入口。

## 何时使用

- 需要常驻的图标启动条（应用入口、工具条），而不是单颗 FAB。
- 与 [SpeedDial](/components/SpeedDial)（悬浮操作簇）、[ScrollTop](/components/ScrollTop)（回顶）按角色区分。

## 引入

```ts
import { MDock } from "morya-ui";
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数       | 类型                                                       | 默认值     | 说明                                      |
| ---------- | ---------------------------------------------------------- | ---------- | ----------------------------------------- |
| `model`    | `DockItem[]`                                               | `[]`       | 图标项。                                  |
| `position` | `'bottom' \| 'top'`                                        | `'bottom'` | 视觉位置修饰。                            |
| `pt`       | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —          | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Events

无自定义事件。

## Slots

| 插槽名    | 说明     |
| --------- | -------- |
| `default` | 停靠项。 |

## 类型

<h4 id="DockItem">DockItem</h4>

完整定义见源码 `types.ts`。

```ts
interface DockItem extends Omit<MenuNodeBase, "label"> {
  label: string;
}
```

## 与 ant-design

对应 antd `FloatButton` 场景中的**应用级启动栏**角色；不是单一悬浮按钮。详见 [antd 映射](/docs/antd-mapping)。
