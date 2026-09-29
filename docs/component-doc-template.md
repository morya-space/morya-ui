# 组件文档模板（Phase 1）

新建或大改组件文档时，中英文（`docs/index.md` / `docs/index.en.md`）请按此骨架。目标对齐 ant-design 组件页信息结构，同时保留 morya API 词汇。

## Frontmatter

```yaml
---
title: ComponentName
category: 01 / BASIC # `序号 / 分类LABEL`，分类参与总览排序
description: 一句话说明组件用途（会出现在总览卡片）。
---
```

可选后续字段（Phase 2）：`subtitle`、`cover`。

## 正文骨架

```md
# ComponentName

一句话复述 description（可稍展开）。

## 何时使用

- 适用场景 1
- 适用场景 2
- 与相近组件的边界（如有）

## 引入

\`\`\`ts
import { MComponentName } from 'morya-ui'
\`\`\`

## 代码演示

### 基础用法

简短说明。

\`\`\`vue preview src="./demos/Basic.vue"
\`\`\`

### …其他演示

每个演示一节：标题 + 1～3 句说明 + preview。

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |

### Events

| 事件名 | 参数 | 说明 |
| ------ | ---- | ---- |

### Slots

| 插槽名 | 说明 |
| ------ | ---- |

### Instance（如有）

| 方法 / 属性 | 说明 |
| ----------- | ---- |

## Design Token（可选）

复用全局 `--m-*`，见[设计令牌](/docs/design-tokens)。有组件级变量时列 `--m-component-*` 表。

## Semantic DOM（建议）

用稳定结构名列出可定制节点（root / icon / label…），并交叉链到 [Common Props](/docs/common-props) 与 [样式与 attrs](/docs/attrs)。叶子组件注明「根即交互元素」。

## FAQ

### 常见问题标题

简短回答。无 FAQ 时可省略本节。

## 无障碍

键盘、焦点、`aria-*`、图标按钮命名等要点。
```

## 检查清单

- [ ] 总览用 `description` 可读、非空
- [ ] 「何时使用 / When to use」至少一行场景说明
- [ ] 至少 1 个基础 preview demo
- [ ] Props / Events / Slots 与实现一致（可跑 `pnpm docs:sync-attrs`）
- [ ] 中英文结构对应（章节可同序不同文案）
- [ ] 本地过骨架机检：`pnpm check:docs-skeleton`
