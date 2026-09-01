---
title: 无障碍
order: 8
description: 使用 Well Insight 组件时的无障碍约定与检查清单。
---

# 无障碍

Well Insight 以**语义化 HTML 优先、必要时补充 ARIA**为原则。组件尽量自带标签关联、键盘路径与浮层焦点管理；业务侧仍需提供有意义的文案与结构。

## 快速检查清单

| 场景 | 建议 |
| --- | --- |
| 图标按钮 | 设置 `aria-label` 或可见文本，勿仅靠图标传达含义 |
| 表单字段 | 使用 `label`；错误时用 `invalid` + `error-message` |
| 装饰性图标 | 省略 `label`，组件会使用 `aria-hidden` |
| 浮层 / 对话框 | 确认 Esc 可关闭；打开后焦点在面板内 |
| 动效敏感用户 | 使用 `useMotion()` 设为 `reduced` 或 `none` |
| 仅颜色区分状态 | 同时提供文案、图标或 `error-message` |

## 表单与校验

输入类组件（`Input`、`Textarea`、`Select` 等）共享字段模式：

```vue
<WiInput
  id="email"
  v-model="email"
  label="邮箱"
  invalid
  error-message="请输入有效邮箱"
/>
```

要点：

- **`label`** 会关联到控件；配合 `FloatLabel` 时也会写入 `for`。
- **`invalid`** 会设置 `aria-invalid` 与错误样式。
- **`error-message`** 会通过 `aria-describedby` 关联帮助/错误区域。
- 必填请同时使用原生 `required`（若组件支持）或业务层校验提示，不要只用颜色表达。

## 图标与按钮

`WiIcon` 仅承载**系统图标**。无 `label` 时视为装饰并隐藏；信息性图标请传 `label`：

```vue
<WiIcon name="info" label="更多信息" />
<WiButton icon="search" aria-label="搜索" icon-only />
```

带文字的按钮优先用默认插槽或 `label`，不必重复 `aria-label`。

## 浮层与焦点

以下组件默认 Teleport 到 `body`，并在打开时锁定滚动、支持 `Escape` 关闭：

- `Dialog`、`Drawer`、`CommandMenu`
- `Select`、`Popover`、`Tooltip`（按组件实现）

弹出层触发器应设置：

- `aria-expanded` / `aria-controls`（如 `Popover`）
- 可见标签或 `aria-label`

模态对话框打开后，焦点应落在可交互元素上；关闭后宜将焦点还原到触发器（业务层使用 `Dialog` 时可自行管理）。

## 键盘交互

| 组件 | 常用按键 |
| --- | --- |
| `CommandMenu` | `↑`/`↓` 选择，`Enter` 执行，`Esc` 关闭 |
| `Select` | `Enter`/`Space` 打开，`↑`/`↓` 移动选项，`Esc` 关闭 |
| `Tabs` | 方向键在 Tab 列表间移动（实现依组件） |
| `Slider` | 方向键调整值；可通过 `aria-label` 命名 |

具体行为以各组件文档为准；新增组件请在 `docs/` 中说明键盘表。

## 动效与对比度

```ts
import { useMotion } from '@well-insight/ui'

const { setMotion } = useMotion()
setMotion('reduced') // 或 'none'
```

`reduced` / `none` 会缩短或关闭 `--wi-motion-*` 过渡，减轻 vestibular 不适。

颜色应通过 `--wi-color-*` 令牌消费，以保证亮/暗主题下对比度一致。自定义主题后请在真实内容上抽查正文与错误态可读性。

## 组件库内已知实践

近期实现/改进包括：

- **FloatLabel**：`label[for]` 关联首个输入控件
- **Popover**：触发器 `aria-expanded` / `aria-haspopup` / `aria-controls`
- **Slider**：单 thumb 默认 `aria-label`（可通过 prop 覆盖）

仍在持续改进的区域见 [优化路线图](https://github.com/well-insight/well-insight-ui/blob/main/docs/OPTIMIZATION.md) 阶段四、五。

## 测试建议

- 使用键盘完成主流程（Tab、Enter、Esc、方向键）。
- 使用系统屏幕阅读器（NVDA / VoiceOver）抽查表单与对话框。
- 在 `prefers-reduced-motion: reduce` 或 `useMotion('none')` 下确认界面仍可用。

## 相关

- [主题](/docs/theme)：动效偏好与令牌
- [全局配置](/docs/config)：语言包与默认尺寸
