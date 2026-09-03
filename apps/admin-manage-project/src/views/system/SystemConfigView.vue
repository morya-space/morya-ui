<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput, WiLayoutContent, WiTable } from '@well-insight/ui'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { systemParams, type SystemParam } from '@/mock'

type SystemParamRow = SystemParam & Record<string, unknown>

const feedback = useActionFeedback()
const rows = ref<SystemParamRow[]>(systemParams.map((item) => ({ ...item })))

const columns = [
  { key: 'group', label: '分组', width: 96 },
  { key: 'key', label: '参数键' },
  { key: 'value', label: '参数值', width: 160 },
  { key: 'description', label: '说明' },
  { key: 'actions', label: '操作', width: 96 },
]

function save(row: SystemParamRow) {
  feedback.notify('参数已更新', row.key)
}
</script>

<template>
  <WiLayoutContent content-class="config-page">
    <header class="config-page__intro">
      <h1 class="config-page__title">系统配置</h1>
      <p class="config-page__desc">动态参数修改后即时生效，无需重启服务（纯前端演示）。</p>
    </header>

    <WiTable
      :columns="columns"
      :rows="rows"
      striped
      bordered
      :paginator="false"
      aria-label="系统参数列表"
    >
      <template #cell-value="{ row }">
        <WiInput v-model="(row as SystemParamRow).value" size="small" />
      </template>
      <template #cell-actions="{ row }">
        <WiButton size="small" @click="save(row as SystemParamRow)">保存</WiButton>
      </template>
    </WiTable>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.config-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.config-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.config-page__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
