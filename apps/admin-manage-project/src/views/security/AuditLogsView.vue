<script setup lang="ts">
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { auditLogs } from '@/mock'

const columns = [
  { key: 'operator', label: '操作人' },
  { key: 'action', label: '动作', width: 88 },
  { key: 'target', label: '对象' },
  { key: 'ip', label: 'IP', width: 120 },
  { key: 'time', label: '时间', width: 140 },
]
</script>

<template>
  <ListPageTemplate
    title="审计日志"
    table-label="审计日志列表"
    :columns="columns"
    :rows="auditLogs"
    :paginator="false"
    :show-create="false"
  />
</template>
