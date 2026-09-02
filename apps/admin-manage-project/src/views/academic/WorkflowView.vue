<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiLayoutContent,
  WiProgressBar,
  WiStepper,
  WiTable,
  WiTag,
  WiTimeline,
} from '@well-insight/ui'
import { workflowTasks } from '@/mock'

const activeStep = ref(1)

const steps = [
  { label: '提交申请', description: '教师 / 学生' },
  { label: '教务审核', description: '教务' },
  { label: '院系审批', description: '院长' },
  { label: '归档', description: '系统' },
]

const columns = [
  { key: 'title', label: '标题' },
  { key: 'applicant', label: '申请人', width: 96 },
  { key: 'step', label: '当前节点', width: 112 },
  { key: 'status', label: '状态', width: 96 },
  { key: 'updatedAt', label: '更新时间', width: 140 },
]

const timeline = [
  { content: '申请已提交', date: '2026-09-02 09:00', severity: 'info' as const },
  { content: '教务审核通过', date: '2026-09-02 10:15', severity: 'success' as const },
  { content: '等待院系审批', date: '待定', severity: 'warn' as const },
]
</script>

<template>
  <WiLayoutContent content-class="workflow-page">
    <h1 class="workflow-page__title">审批流程</h1>

    <WiCard title="流程进度示意">
      <WiStepper v-model="activeStep" :steps="steps" />
      <WiProgressBar :value="((activeStep + 1) / steps.length) * 100" />
    </WiCard>

    <div class="workflow-page__split">
      <WiCard title="待办列表">
        <WiTable :columns="columns" :rows="workflowTasks as unknown as Record<string, unknown>[]" striped bordered :paginator="false">
          <template #cell-status="{ value }">
            <WiTag
              :value="value === 'pending' ? '待审批' : value === 'approved' ? '已通过' : '已驳回'"
              :severity="value === 'pending' ? 'warn' : value === 'approved' ? 'success' : 'danger'"
            />
          </template>
        </WiTable>
      </WiCard>

      <WiCard title="最近动态（示例）">
        <WiTimeline :value="timeline" />
        <WiButton style="margin-top: var(--wi-space-4)">刷新</WiButton>
      </WiCard>
    </div>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.workflow-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.workflow-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.workflow-page__split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--wi-space-4);
}

@media (max-width: 56rem) {
  .workflow-page__split {
    grid-template-columns: 1fr;
  }
}
</style>
