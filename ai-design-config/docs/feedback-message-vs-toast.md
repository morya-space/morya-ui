# Message / Toast / WiMessage 选型指南

> **AI 默认规则：操作反馈优先用 `message` API；只有需要「标题 + 详情」或异步通知时才用 `toast`。**

## 三个不同的东西

| 名称 | 形态 | API / 组件 | 典型场景 |
| --- | --- | --- | --- |
| **Message 服务** | 顶部居中（可改 placement）单行浮层 | `message.success('已保存')` | **大多数** CRUD / 保存 / 删除回执 |
| **Toast 服务** | 四角通知，带 `summary` + 可选 `detail` | `toast.success({ summary, detail })` | 需要补充说明的通知、后台任务结果 |
| **WiMessage 组件** | 页面内嵌条，不自动消失 | `<WiMessage severity="error">…</WiMessage>` | 表单/认证区**常驻**错误、警告 |

## 决策树（按顺序判断）

```
用户操作完成，需要即时反馈？
├─ 否 → 不需要 Message/Toast（可能用 WiConfirmDialog / 字段 errorMessage）
└─ 是 → 错误需留在表单区域直到用户修正？
    ├─ 是 → <WiMessage> 或字段级 invalid / errorMessage
    └─ 否 → 只有一句短文案（无独立 detail）？
        ├─ 是 → message.success / info / warn / error   ← 默认选这个
        └─ 否 → 有 summary + detail，或异步/后台通知感 → toast.*
```

## 优先用 Message 的场景（占多数）

- 创建 / 更新 / 删除成功：`message.success('已保存')`
- 移入回收站、批量操作完成（单行概括）：`message.info('已移入回收站')`
- 轻量警告（非表单绑定）：`message.warn('请先选择记录')`
- 请求失败（单行）：`message.error('保存失败，请重试')`
- 复制成功、导入触发等**一句话**反馈

```ts
import { message } from '@well-insight/ui'

message.success('已创建')
message.info('已移入回收站')
message.error('操作失败')
```

## 应该用 Toast 的场景（较少）

- **同时**需要标题与补充说明：

  ```ts
  toast.success({
    summary: '选课申请已提交',
    detail: '请等待教务审核',
  })
  ```

- 后台任务 / 批量结果含统计明细：

  ```ts
  toast.success({
    summary: '导入完成',
    detail: '成功 128 条，失败 2 条',
  })
  ```

- 登录成功且需欢迎语 + 副文案
- 需要角落堆叠、用户可能稍后查看的多条**通知**（非即时操作回执）

## 应该用 WiMessage 组件的场景

- 登录 / 注册表单上方的**持久**错误（用户修正前不消失）
- 页面级配置错误、需要与表单同区域的警告条
- **不要**把字段校验错误只丢到 Toast/Message 浮层——优先字段 `errorMessage`

```vue
<WiMessage v-if="error" severity="error" :closable="false">
  {{ error }}
</WiMessage>
```

## 反模式（AI 禁止）

| 反模式 | 应改为 |
| --- | --- |
| `toast.add({ summary: '已保存' })` 无 detail | `message.success('已保存')` |
| 表单校验失败只弹 Toast | 字段 `errorMessage` 或 `<WiMessage>` |
| 删除确认用 Message/Toast | `WiConfirmDialog` |
| 所有反馈都用 Toast | 默认改 Message，仅 detail 场景保留 Toast |

## 与 Naive / Element Plus 的对应

| Well Insight | 近似概念 |
| --- | --- |
| `message` | Naive `message` / Element `ElMessage` |
| `toast` | Naive `notification` / Element `ElNotification` |
| `<WiMessage>` | 页面内 `el-alert` / 表单顶部错误条 |

## 相关文档

- [Message 组件文档](../../src/components/Message/docs/index.md)
- [Toast 组件文档](../../src/components/Toast/docs/index.md)
- [DESIGN.md §6 浮层与反馈](../DESIGN.md#6-浮层与反馈)
