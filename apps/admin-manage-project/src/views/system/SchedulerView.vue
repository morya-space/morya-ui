<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  WiButton,
  WiFormItem,
  WiInput,
  WiSelect,
  WiSpace,
  WiTag,
} from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import RecordFormDialog from '@/components/RecordFormDialog.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useCrudDialog } from '@/composables/useCrudDialog'
import { useLocale } from '@/composables/useLocale'
import type { SchedulerJob } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.schedulerJobs
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<SchedulerJob>()

const form = reactive({
  name: '',
  cron: '0 0 * * *',
  lastRun: '-',
  nextRun: '-',
  status: 'idle' as SchedulerJob['status'],
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', cron: '0 0 * * *', lastRun: '-', nextRun: '-', status: 'idle' })
})

const columns = computed(() => [
  { key: 'name', label: t('任务名称', 'Job') },
  { key: 'cron', label: 'Cron', width: 120 },
  { key: 'lastRun', label: t('上次执行', 'Last run'), width: 140 },
  { key: 'nextRun', label: t('下次执行', 'Next run'), width: 140 },
  { key: 'status', label: t('状态', 'Status'), width: 96 },
  { key: 'actions', label: t('操作', 'Actions'), width: 220 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建任务', 'New job') : t('编辑任务', 'Edit job'),
)

function statusLabel(value: unknown) {
  if (value === 'running') return t('运行中', 'Running')
  if (value === 'paused') return t('已暂停', 'Paused')
  return t('空闲', 'Idle')
}

function runNow(row: SchedulerJob) {
  store.update(row.id, { lastRun: new Date().toISOString().slice(0, 16).replace('T', ' ') })
  feedback.notify(t('任务已触发', 'Job triggered'), row.name)
}

function togglePause(row: SchedulerJob) {
  const next = row.status === 'paused' ? 'idle' : 'paused'
  store.update(row.id, { status: next })
}

function saveForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  if (mode.value === 'create') {
    store.create({ ...form })
    feedback.ok(t('已创建', 'Created'))
  } else if (editingRow.value) {
    store.update(editingRow.value.id, { ...form })
    feedback.ok(t('已更新', 'Updated'))
  }
  closeDialog()
}

function onDeleteRow(row: SchedulerJob) {
  store.remove(row.id)
  feedback.ok(t('已删除', 'Deleted'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('定时任务', 'Scheduler')"
    :table-label="t('定时任务列表', 'Scheduler jobs')"
    :columns="columns"
    :rows="store.items.value"
    :paginator="false"
    @create="openCreate()"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="statusLabel(value)"
        :severity="value === 'running' ? 'success' : value === 'paused' ? 'warn' : 'info'"
      />
    </template>

    <template #cell-actions="{ row }">
      <WiSpace wrap>
        <WiButton size="small" severity="secondary" @click="runNow(row as SchedulerJob)">
          {{ t('立即执行', 'Run now') }}
        </WiButton>
        <WiButton size="small" severity="secondary" @click="togglePause(row as SchedulerJob)">
          {{ (row as SchedulerJob).status === 'paused' ? t('恢复', 'Resume') : t('暂停', 'Pause') }}
        </WiButton>
        <WiButton size="small" severity="secondary" @click="openEdit(row as SchedulerJob)">
          {{ t('编辑', 'Edit') }}
        </WiButton>
        <WiButton size="small" severity="danger" @click="onDeleteRow(row as SchedulerJob)">
          {{ t('删除', 'Delete') }}
        </WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('任务名称', 'Job')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem label="Cron" name="cron" required>
      <WiInput v-model="form.cron" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('空闲', 'Idle'), value: 'idle' },
          { label: t('运行中', 'Running'), value: 'running' },
          { label: t('已暂停', 'Paused'), value: 'paused' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
