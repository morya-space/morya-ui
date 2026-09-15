---
title: Page
category: 06 / LAYOUT
description: 业务页面组合区块，封装间距、边框与标题层级，少写或不写页面 CSS。
---

# Page

业务页面组合组件。与 `MLayout` 搭配使用，把列表页筛选区、工具栏、表单分组、KPI 卡片等常见区块的间距和边框内聚到组件内，**优先用 Page 组件拼装页面，而不是每页手写 scoped CSS**。

## 引入

```ts
import {
  MPageContent,
  MPageFilters,
  MPageHeader,
  MPagePlaceholder,
  MPageSection,
  MPageStat,
  MPageToolbar,
} from 'morya-ui'
```

## 列表页组合

`MPageContent` 负责内容区 **padding**（默认 `--m-space-6`）与子区块 **gap**（默认 `--m-space-4`），文档预览中外框仅模拟 `MLayoutContent` 边界。

```vue preview
<script setup lang="ts">
import {
  MButton,
  MInput,
  MPageContent,
  MPageFilters,
  MPageToolbar,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent>
      <MPageFilters aria-label="筛选">
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="搜索" clearable style="width:12rem" />
          <MButton severity="primary">
            查询
          </MButton>
        </MSpace>
      </MPageFilters>
      <MPageToolbar title="用户管理">
        <template #actions>
          <MButton severity="primary">
            新建
          </MButton>
        </template>
      </MPageToolbar>
    </MPageContent>
  </div>
</template>
```

## 表单页组合

`MPageContent width="narrow"` 限制表单宽度；`MPageSection variant="form"` 提供表单表面；`variant="actions"` 用于底栏操作。

```vue preview
<script setup lang="ts">
import {
  MButton,
  MForm,
  MFormItem,
  MInput,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent width="narrow">
      <MPageHeader title="新建用户" description="填写基本信息。" />
      <MPageSection variant="form">
        <MForm @submit.prevent>
          <MFormItem label="姓名" name="name">
            <MInput v-model="name" fluid />
          </MFormItem>
          <MPageSection variant="actions">
            <MSpace>
              <MButton native-type="submit" severity="primary">
                保存
              </MButton>
              <MButton severity="secondary">
                取消
              </MButton>
            </MSpace>
          </MPageSection>
        </MForm>
      </MPageSection>
    </MPageContent>
  </div>
</template>
```

## 仪表盘 KPI

```vue preview
<script setup lang="ts">
import { MPageContent, MPageStat } from 'morya-ui'
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent density="compact">
      <MPageStat label="总用户" value="12,480" trend="+8.2%" icon="users" />
    </MPageContent>
  </div>
</template>
```

## 组合规则

| 场景 | 推荐组件 | 避免 |
| --- | --- | --- |
| 内容区垂直堆叠 | `MPageContent` | 手写 `gap` / `padding` |
| 筛选区 | `MPageFilters` + `MSpace` / `MFlex` | 额外包一层 `MCard` |
| 标题 + 主操作 | `MPageToolbar` | 裸 `div` + `justify-content` |
| 页面说明 | `MPageHeader` | 无层级的裸 `h1` |
| 表单主体 | `MPageSection variant="form"` | 重复边框的 `MCard` 嵌套 |
| 列表表格 | 直接放 `MTable` | `MCard` 再包 `MTable bordered` |
| KPI | `MPageStat` | 每页自定义 stat CSS |
| 图表占位 | `MPagePlaceholder` |  dashed border 手写样式 |

完整黄金样例见 `docs/golden-pages/`（MCP：`get_golden_page`）。**局部修改**时用 MCP `get_page_snippet`（如 `filters`、`toolbar`、`form-actions`）。

## API

### MPageContent

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `density` | `'default' \| 'compact' \| 'spacious'` | `'default'` | 子区块垂直间距。 |
| `width` | `'full' \| 'narrow'` | `'full'` | `narrow` 约 42rem，适合表单页。 |

### MPageFilters

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | 筛选区无障碍名称。 |

### MPageToolbar

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 页面标题。 |
| `headingLevel` | `1–6` | `1` | 标题层级。 |

| Slot | 说明 |
| --- | --- |
| `default` | 无 `title` 时的左侧内容。 |
| `actions` | 右侧操作区。 |

### MPageHeader

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 页面标题。 |
| `description` | `string` | — | 副标题/说明。 |
| `headingLevel` | `1–6` | `1` | 标题层级。 |

| Slot | 说明 |
| --- | --- |
| `actions` | 右侧操作。 |

### MPageSection

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'muted' \| 'form' \| 'actions'` | `'default'` | 视觉变体。 |
| `title` | `string` | — | 可选分组标题。 |

### MPageStat

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 指标名称。 |
| `value` | `string \| number` | — | 主数值。 |
| `trend` | `string` | — | 变化量或说明。 |
| `trendSeverity` | `'primary' \| 'success' \| 'warn' \| 'danger' \| 'secondary'` | `'primary'` | 趋势色。 |
| `icon` | `string` | — | 右侧图标名。 |

### MPagePlaceholder

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | — | 占位说明。 |
| `ariaLabel` | `string` | `'Placeholder'` | 无障碍标签。 |
| `minHeight` | `number \| string` | `'12rem'` | 最小高度。 |
