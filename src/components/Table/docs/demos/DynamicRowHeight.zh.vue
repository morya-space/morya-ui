<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'id', label: 'ID', width: 80 },
  { key: 'title', label: '标题', minWidth: 200 },
  { key: 'summary', label: '摘要', minWidth: 320 },
]

// 模拟内容长度不一的行：摘要字段长短不同 → 行高不同
const rows = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  title: `任务 ${i + 1}`,
  summary: i % 7 === 0
    ? `这是一段比较长的摘要，用来演示动态行高。`.repeat((i % 5) + 2)
    : `简短摘要 ${i + 1}`,
}))
</script>

<template>
  <MTable
    :columns="columns"
    :rows="rows"
    virtual
    virtual-dynamic-row-height
    :virtual-row-height="44"
    :max-height="360"
    bordered
    :paginator="false"
  />
</template>
