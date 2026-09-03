<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiConfirmDialog,
  WiFileUpload,
  WiLayoutContent,
  WiProgressBar,
  WiSpace,
  WiTag,
} from '@well-insight/ui'
import { useActionFeedback } from '@/composables/useActionFeedback'

const feedback = useActionFeedback()
const importing = ref(false)
const progress = ref(0)
const deleteOpen = ref(false)

async function simulateImport() {
  importing.value = true
  progress.value = 0
  for (let i = 1; i <= 5; i++) {
    await new Promise((r) => setTimeout(r, 300))
    progress.value = i * 20
  }
  importing.value = false
  feedback.notify('导入完成', '成功 128 条，失败 2 条')
}

function confirmDelete() {
  deleteOpen.value = false
  feedback.notify('批量删除完成', '已选 0 条记录未变更')
}
</script>

<template>
  <WiLayoutContent content-class="batch-ops">
    <header class="batch-ops__intro">
      <h1 class="batch-ops__title">批量操作</h1>
      <p class="batch-ops__desc">支持 Excel、CSV 导入导出与批量删除（演示）</p>
    </header>

    <div class="batch-ops__grid">
      <WiCard title="批量导入" class="batch-ops__card">
        <p class="batch-ops__card-desc">上传 Excel / CSV 批量导入学生、课程或成绩数据。</p>
        <WiFileUpload mode="basic" accept=".xlsx,.csv" />
        <WiProgressBar v-if="importing || progress" :value="progress" />
        <WiButton :loading="importing" @click="simulateImport">开始导入</WiButton>
      </WiCard>

      <WiCard title="批量导出" class="batch-ops__card">
        <p class="batch-ops__card-desc">按筛选条件导出当前列表数据。</p>
        <WiSpace wrap>
          <WiButton severity="secondary">导出 CSV</WiButton>
          <WiButton severity="secondary">导出 Excel</WiButton>
          <WiButton severity="secondary">生成 PDF 报表</WiButton>
        </WiSpace>
      </WiCard>

      <WiCard title="批量删除" class="batch-ops__card">
        <p class="batch-ops__card-desc">对已选记录执行批量删除，删除后可在回收站恢复。</p>
        <WiSpace wrap align="center">
          <WiTag value="已选 0 条" severity="info" />
          <WiButton severity="danger" @click="deleteOpen = true">批量删除</WiButton>
        </WiSpace>
      </WiCard>
    </div>

    <WiConfirmDialog
      v-model="deleteOpen"
      header="确认批量删除？"
      message="此操作不可撤销，确定要删除已选记录吗？"
      accept-label="确认"
      reject-label="取消"
      accept-severity="danger"
      @accept="confirmDelete"
    />
  </WiLayoutContent>
</template>

<style scoped>
:deep(.batch-ops) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.batch-ops__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.batch-ops__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.batch-ops__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--wi-space-4);
}

.batch-ops__card {
  box-shadow: var(--wi-shadow-sm);
}

.batch-ops__card-desc {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
