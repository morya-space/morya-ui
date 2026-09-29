---
title: antd 组件映射
order: 8.5
description: ant-design 组件名到 morya-ui 的对照与能力边界（不改 API 词表）。
---

# antd 组件映射

从 ant-design（React）迁到 morya-ui（Vue）时，对照「场景 / 角色」，不要按同名 1:1 抄 API。

## 原则

| 原则                   | 说明                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| 学结构，不克隆         | 对齐信息架构与文档完整度，不复刻 antd 皮肤或整站 dumi                           |
| 保留 morya 词表        | 继续用 `severity` / `variant` / `--m-*`；不要改回 `type="primary"` 等 antd 命名 |
| 文档在 Vite playground | 指南与组件页都在本站，不依赖 dumi                                               |
| 不臆造缺失 API         | 表格「边界」列写清未覆盖能力；需要路线见仓库 `docs/antd-parity-roadmap.md`      |

相关阅读：[约定](/docs/conventions)、[Common Props](/docs/common-props)、[设计](/docs/design)、[主题编辑器](/theme-editor)。

## 组件对照

| antd                         | morya                                                                                                           | 角色 / 用法                                                   | 能力边界                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| `FloatButton`                | [SpeedDial](/components/SpeedDial) / [ScrollTop](/components/ScrollTop) / [Dock](/components/Dock)              | 浮动操作簇 → SpeedDial；回顶 → ScrollTop；应用级启动栏 → Dock | 无单一 `FloatButton`；按角色选型                   |
| `Transfer`                   | [PickList](/components/PickList)                                                                                | 左右穿梭选值                                                  | API 与数据结构跟 morya，不复制 antd Transfer props |
| `TimePicker`                 | [TimePicker](/components/TimePicker)（`MTimePicker`）                                                           | 等价于 `MDatePicker` + `type="time"`                          | 优先用独立入口；日期/范围仍走 DatePicker           |
| `ColorPicker`                | [InputColor](/components/InputColor)                                                                            | 原生色板 + 色板预设                                           | 不是完整 antd 面板（无独立 alpha 面板级能力）      |
| `Cascader`                   | [CascadeSelect](/components/CascadeSelect)                                                                      | 单选叶子节点                                                  | 当前无 search / multi / `loadData`                 |
| `App`                        | [ConfigProvider](/components/ConfigProvider) + `createMoryaUI`（installer）+ `toast` / `message` / modal 类 API | 主题/locale/反馈宿主                                          | **未发布 `MApp`**；用 Provider + 安装器 + 服务 API |
| `DatePicker` / `RangePicker` | [DatePicker](/components/DatePicker)（`MDatePicker`）                                                           | 用 `type` 区分模式                                            | 见下表                                             |

### DatePicker `type` 对照

| antd 场景          | morya                                                 |
| ------------------ | ----------------------------------------------------- |
| 日期               | `type="date"`（默认）                                 |
| 范围 `RangePicker` | `type="daterange"`                                    |
| 日期时间           | `type="datetime"`                                     |
| 日期时间范围       | `type="datetimerange"`                                |
| 仅时间             | `type="time"` 或 [TimePicker](/components/TimePicker) |
| 月 / 年            | `type="month"` / `type="year"`                        |

## 迁移提示

1. **先定角色再选组件**：例如浮动按钮先问「回顶 / 操作簇 / Dock」，再打开对应文档。
2. **改词不改意图**：`type="primary"` → `severity="primary"`（常可省略）；外观用 `variant`。
3. **反馈分层**：短结果用 `message`；带摘要+详情或异步用 `toast`；确认用 Confirm 系列，不要用 `MApp` 想象宿主。
4. **缺能力就查边界**：Cascader 多选/搜索、完整 Color 面板、统一 App 壳等仍在路线图，见仓库 `docs/antd-parity-roadmap.md`。
5. **主题与公共 props**：调色与密度用 [/theme-editor](/theme-editor)；跨组件约定见 [/docs/common-props](/docs/common-props)。

## 相关链接

- [设计](/docs/design) · [Common Props](/docs/common-props) · [约定](/docs/conventions) · [主题编辑器](/theme-editor)
- 组件：[SpeedDial](/components/SpeedDial) · [ScrollTop](/components/ScrollTop) · [Dock](/components/Dock) · [PickList](/components/PickList) · [TimePicker](/components/TimePicker) · [DatePicker](/components/DatePicker) · [InputColor](/components/InputColor) · [CascadeSelect](/components/CascadeSelect) · [ConfigProvider](/components/ConfigProvider)
- 维护者路线图：仓库 `docs/antd-parity-roadmap.md`
