---
title: 反馈
order: 4.56
description: Message、Toast、Dialog、Alert 等反馈层级与选型。
---

# 反馈

反馈回答三件事：**发生了什么、要不要打断、用户下一步做什么**。Morya 用不同组件表达打断程度，而不是一律弹窗。

## 层级（轻 → 重）

| 打断度 | 组件 / API | 适用 |
| --- | --- | --- |
| 页面内常驻 | `MAlert` | 规则说明、部分失败摘要、可关闭提示条 |
| 短暂结果 | `message` / `MMessage` | 保存成功、复制成功等一句话结果 |
| 摘要 + 过程 | `toast` / `MToast` | 带详情、异步进度、可操作的短暂通知 |
| 需抉择 | `MConfirmDialog` / `MConfirmPopup` / `useConfirm` | 删除、放弃编辑等确认 |
| 任务流模态 | `MDialog` / `MDrawer` | 表单、详情、多步（非单纯确认） |
| 阻塞等待 | `MLoading`（细环可用 `MProgressSpinner`） | 全页 / 区域加载 |
| 可量化进度 | `MProgressBar` | 上传、长任务百分比 |
| 空 / 结果页 | `MEmpty` / `MResult` | 无数据、404、提交成功落地 |

选型摘要亦见 [约定](/docs/conventions)。

## 原则

- **能不打断就不打断**：成功保存优先 `message`，不要每次 `Dialog`。
- **破坏性必须确认**：删除 / 清空用 `danger` + Confirm，文案说清后果。
- **同源语义色**：成功 / 警告 / 危险与按钮 `severity` 同一套（见 [色彩](/docs/design-color)）。
- **层叠有序**：Toast 高于下拉，Dialog 遮罩统一走 `--m-z-*` / Config `zIndex`。
- **可关闭与焦点**：模态应支持 Esc；打开后焦点进入面板（见 [无障碍](/docs/accessibility)）。

## Message vs Toast

| | Message | Toast |
| --- | --- | --- |
| 信息量 | 短句 | 标题 / 内容 / 操作更完整 |
| 时长 | 较短 | 可较长，适合异步 |
| 典型 | 「已保存」 | 「导出完成，点击下载」 |

两者都是轻反馈；需要用户填表或阅读长文请改用 Dialog / Drawer。

## 加载与空态

| 场景 | 用法 |
| --- | --- |
| 首屏结构已知 | `MSkeleton`，避免布局跳动 |
| 未知时长阻塞 | `MLoading` |
| 列表无行 | `MEmpty` + 明确次要操作（新建 / 清空筛选） |
| 流程结束 | `MResult`（成功 / 失败）+ 返回入口 |

动效强度影响 spinner / skeleton 循环——见 [动效（设计）](/docs/design-motion) 与 [动效](/docs/motion)。

## 建议与避免

| 建议 | 避免 |
| --- | --- |
| 同一操作路径固定一种成功反馈 | 成功同时 Toast + Message + Alert |
| Confirm 主按钮用 `danger` 表达破坏 | 用主色按钮标「删除」 |
| 错误给出可执行下一步 | 只写「失败」无原因 |
| 区域加载包住该区域 | 局部请求却全屏 Loading |

返回总览：[设计语言](/docs/design)。工程配置见 [全局配置](/docs/config)。
