<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { errorRecords } from '@/mock'

const columns = [
  { key: 'endpoint', label: '接口' },
  { key: 'code', label: '状态码', width: 88 },
  { key: 'message', label: '错误信息' },
  { key: 'count', label: '次数', width: 72 },
  { key: 'lastSeen', label: '最近出现', width: 140 },
]
</script>

<template>
  <ListPageTemplate
    title="异常监控"
    table-label="异常监控列表"
    :columns="columns"
    :rows="errorRecords"
    :paginator="false"
    :show-create="false"
  >
    <template #cell-code="{ value }">
      <WiTag :value="String(value)" :severity="Number(value) >= 500 ? 'danger' : 'warn'" />
    </template>
  </ListPageTemplate>
</template>
