<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { dictionaries } from '@/mock'

const columns = [
  { key: 'type', label: '字典类型', width: 140 },
  { key: 'label', label: '显示名' },
  { key: 'value', label: '值', width: 120 },
  { key: 'sort', label: '排序', width: 72 },
  { key: 'status', label: '状态', width: 88 },
]
</script>

<template>
  <ListPageTemplate
    title="字典管理"
    table-label="字典列表"
    :columns="columns"
    :rows="dictionaries"
    :paginator="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'enabled' ? '启用' : '停用'" :severity="value === 'enabled' ? 'success' : 'secondary'" />
    </template>
  </ListPageTemplate>
</template>
