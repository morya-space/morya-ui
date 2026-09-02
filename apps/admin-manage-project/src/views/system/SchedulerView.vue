<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiSpace, WiTag, useToast } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { schedulerJobs } from '@/mock'

const toast = useToast()
const rows = ref(schedulerJobs)

const columns = [
  { key: 'name', label: '任务名称' },
  { key: 'cron', label: 'Cron', width: 120 },
  { key: 'lastRun', label: '上次执行', width: 140 },
  { key: 'nextRun', label: '下次执行', width: 140 },
  { key: 'status', label: '状态', width: 96 },
  { key: 'actions', label: '操作', width: 160 },
]

function runNow(id: string) {
  toast.add({ severity: 'success', summary: '任务已触发', detail: id, life: 2500 })
}

function togglePause(row: { id: string; status: string }) {
  row.status = row.status === 'paused' ? 'idle' : 'paused'
}
</script>

<template>
  <ListPageTemplate
    title="定时任务"
    table-label="定时任务列表"
    :columns="columns"
    :rows="rows"
    :paginator="false"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'running' ? '运行中' : value === 'paused' ? '已暂停' : '空闲'"
        :severity="value === 'running' ? 'success' : value === 'paused' ? 'warn' : 'info'"
      />
    </template>
    <template #cell-actions="{ row }">
      <WiSpace>
        <WiButton size="small" severity="secondary" @click="runNow(row.id)">立即执行</WiButton>
        <WiButton size="small" severity="secondary" @click="togglePause(row)">
          {{ row.status === 'paused' ? '恢复' : '暂停' }}
        </WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
