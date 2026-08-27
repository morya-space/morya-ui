---
title: Tabs
category: 05 / PANEL
description: 标签页切换。支持 line/card、关闭/新增、extra 与溢出滚动。
---

# Tabs

标签页用于在同一视图内切换内容分区。

## 引入

```ts
import { WiTabs } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTabs } from '@well-insight/ui'
import { ref } from 'vue'

const active = ref('design')
const tabs = [
  { label: 'Design', value: 'design' },
  { label: 'Code', value: 'code' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <WiTabs v-model="active" :tabs="tabs">
    <template #default="{ activeValue }">
      <p style="margin:0">
        Active panel: {{ activeValue }}
      </p>
    </template>
  </WiTabs>
</template>
```

## Card / closable / extra

```vue preview
<script setup lang="ts">
import { WiButton, WiTabs } from '@well-insight/ui'
import { ref } from 'vue'

const active = ref('a')
const tabs = ref([
  { label: '设计', value: 'a' },
  { label: '数据', value: 'b' },
  { label: '发布', value: 'c' },
])

function onClose(value: string) {
  tabs.value = tabs.value.filter((tab) => tab.value !== value)
}

function onAdd() {
  const value = `tab-${tabs.value.length + 1}`
  tabs.value = [...tabs.value, { label: `Tab ${tabs.value.length + 1}`, value }]
  active.value = value
}
</script>

<template>
  <WiTabs
    v-model="active"
    type="card"
    closable
    addable
    :tabs="tabs"
    @close="onClose"
    @add="onAdd"
  >
    <template #extra>
      <WiButton label="操作" size="small" severity="secondary" />
    </template>
    <template #default="{ activeValue }">
      <p style="margin:0">
        {{ activeValue }}
      </p>
    </template>
  </WiTabs>
</template>
```

标签过多超出容器时，两端会出现滚动按钮。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | 当前活动 tab。 |
| `tabs` | `TabItem[]` | — | 标签列表；支持 `disabled` / `closable`。 |
| `type` | `'line' \| 'card'` | `'line'` | 外观。 |
| `closable` | `boolean` | `false` | 显示关闭按钮；单项 `closable` 优先。 |
| `addable` | `boolean` | `false` | 显示新增按钮。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 活动项变化。 |
| `change` | `string` | 切换完成。 |
| `close` | `string` | 点击关闭。 |
| `add` | — | 点击新增。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面板内容，作用域 `{ activeValue }`。 |
| `extra` | 标签栏右侧额外内容。 |
