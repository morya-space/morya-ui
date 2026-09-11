---
title: 指南
order: 11
description: 组件目录约定、文档写法与浮层通用约定。
---

# 指南

## 组件目录

推荐每个公开组件保持如下结构：

```text
src/components/Button/
├── Button.vue
├── types.ts
├── index.ts
├── Button.test.ts
└── docs/
    ├── index.md
    └── index.en.md
```

- **前缀**：组件导出为 `M*`，CSS 类为 `.m-*`。
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

## 样式与 attrs

**字段 / Label 控件**：除绑定在子控件上的 **事件** 外，其余 fallthrough attrs 落在根（field 外层或 `<label>`）；**容器 / 浮层**：全部 attrs 落在组件根；**叶子**：与原生 Vue 一致。详见 [样式与 attrs](/docs/attrs)。

写组件文档时：

- Props / Events 表里的 PascalCase 类型名（如 `DropdownItem`）会自动变成可点击链接：优先跳到文档末尾 **类型** 小节的 `<h4 id="TypeName">`，否则跳到 [API 类型](/docs/types#TypeName)。运行 `pnpm docs:sync-type-sections` 可根据 `types.ts` 补全缺失的类型小节。
- Props 表加上 `pt`（若有），说明可用的 DOM 键名。
- 字段组件说明：事件在原生控件，其它 fallthrough 在 field 根；`placeholder` / `name` 等优先写 props。
- 有非显然落点的（Dialog 的 backdrop、Checkbox 的 label），在正文用一小节或示例说明，不必每页重复整篇指南。

## 浮层约定

所有浮层默认 Teleport 到 `body`，并支持：

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `teleport` | `true` | 是否 Teleport |
| `appendTo` | `'body'` | 挂载目标；`'self'` 就地渲染 |

动效统一：

- 模态：`m-fade`
- 锚定菜单：`m-scale-fade`
- Toast：`m-slide-fade`
- Message：`m-message-slide`（顶部滑入）

全局默认挂载点可通过 [ConfigProvider](/docs/config) 的 `appendTo` 统一设置。

## 图标约定

- **系统图标**：组件内部与通用操作使用 `MIcon` + `name`（见 [Icon](/components/Icon) 注册表）。
- **业务图标**：在应用侧安装 Lucide 等库，通过 `MIcon` 默认插槽或 Button 的 `icon` 组件传入，不要往组件库堆全量 SVG。
