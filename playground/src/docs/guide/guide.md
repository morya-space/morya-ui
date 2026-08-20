---
title: 指南
order: 3
description: 组件目录约定、文档写法与浮层通用约定。
---

# 指南

## 组件目录

推荐每个公开组件保持如下结构：

```text
packages/ui/src/components/Button/
├── Button.vue
├── types.ts
├── index.ts
├── Button.test.ts
└── docs/
    ├── index.md
    └── index.en.md
```

- **前缀**：组件导出为 `Wi*`，CSS 类为 `.wi-*`。
- **类型**：Props / Emits 放在 `types.ts`，并从包入口再导出。
- **测试**：用户行为导向的 Vitest + Vue Test Utils。

## 写文档

在 `docs/index.md`（中文）和 `docs/index.en.md`（英文）顶部写 frontmatter：

```md
---
title: Button
category: 01 / PRIMITIVE
description: 触发动作的按钮
---
```

正文使用 Markdown；可交互示例用 `vue preview` 代码块（文档站会渲染预览并支持查看代码）。两种语言的 `category` 保持一致，文档站切换英文时加载 `index.en.md`，缺失则回退到中文。

分类前缀数字决定侧栏排序，例如：

| 前缀 | 分类 |
| --- | --- |
| `00 / GUIDE` | 指南类（如 ConfigProvider） |
| `01 / PRIMITIVE` | 基础 |
| `02 / FORM` | 表单 |
| `03 / OVERLAY` | 浮层 |

## 浮层约定

所有浮层默认 Teleport 到 `body`，并支持：

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `teleport` | `true` | 是否 Teleport |
| `appendTo` | `'body'` | 挂载目标；`'self'` 就地渲染 |

动效统一：

- 模态：`wi-fade`
- 锚定菜单：`wi-scale-fade`
- Toast：`wi-slide-fade`
- Message：`wi-message-slide`（顶部滑入）

全局默认挂载点可通过 [ConfigProvider](/docs/config) 的 `appendTo` 统一设置。

## 图标约定

- **系统图标**：组件内部与通用操作使用 `WiIcon` + `name`（见 [Icon](/components/Icon) 注册表）。
- **业务图标**：在应用侧安装 Lucide 等库，通过 `WiIcon` 默认插槽或 Button 的 `icon` 组件传入，不要往组件库堆全量 SVG。
