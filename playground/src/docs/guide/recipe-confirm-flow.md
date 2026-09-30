---
title: 确认流程
order: 22
description: 声明式 MConfirmDialog 与命令式 useConfirm 两种确认交互。
---

# 确认流程

删除、停用、覆盖写入等不可轻易撤销的操作，先让用户点一次确认。Morya 提供模板声明式与 `useConfirm().require()` 命令式两条路。

## 目标

- 模板里用 `MConfirmDialog` + `v-model` 控制显隐
- 脚本里用 `useConfirm().require(...)`，得到 `Promise<boolean>`
- 危险操作用 `accept-severity="danger"`（可选 `type="warning"`）

## 何时使用

| 方式 | 适合 |
| --- | --- |
| 声明式 `MConfirmDialog` | 文案/插槽固定、需要和页面状态绑定、要自定义 footer |
| 命令式 `useConfirm` | 工具函数、表格行操作、不想为每个入口挂一个 Dialog |
| Dialog `modal.confirm` | 需要完整 Dialog 能力（异步 `onOk`、自定义内容）。见 [Dialog](/components/Dialog) |

## 步骤

1. **声明式**：`visible` 驱动 `v-model`；按钮打开对话框；监听 `@accept` / `@reject`。
2. **命令式**：`const confirm = useConfirm()`，`await confirm.require({ header, message, ... })`；`true` 表示确认，`false` 表示取消或关闭。
3. 确认按钮语义色用 `acceptSeverity: 'danger'`；需要状态图标时加 `type: 'warning'`。
4. 真正删数据放在确认之后；若删除是异步的，可在声明式路径用 `beforeAccept`，或命令式路径里先 `await` 再反馈结果。

## 预览

```vue preview src="./demos/recipes/ConfirmFlow.zh.vue"
```

## 检查清单

- [ ] 危险操作文案写清楚不可撤销后果
- [ ] 声明式路径绑定了 `@accept` / `@reject`（或等价业务回调）
- [ ] 命令式路径处理了 `false`（取消 / Esc / 点遮罩）
- [ ] 不要把确认框当成普通通知（短反馈用 `message` / `toast`）
- [ ] 已引入 `morya-ui` 与样式

## 相关

- [ConfirmDialog](/components/ConfirmDialog)：`MConfirmDialog`、`useConfirm`
- [Dialog](/components/Dialog)：`useModal` / `modal.confirm`
- [约定](/docs/conventions)：反馈选型
- [快速上手](/docs/quick-start)
