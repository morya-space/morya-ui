<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiLayoutContent, WiTable, WiTabs, WiTag } from '@well-insight/ui'
import { messages } from '@/mock'

const columns = [
  { key: 'channel', label: '渠道', width: 88 },
  { key: 'title', label: '标题' },
  { key: 'template', label: '模板', width: 140 },
  { key: 'sentAt', label: '发送时间', width: 140 },
  { key: 'status', label: '状态', width: 88 },
]

const tab = ref('records')
</script>

<template>
  <WiLayoutContent content-class="messages-page">
    <h1 class="messages-page__title">消息中心</h1>
    <WiTabs
      v-model="tab"
      :tabs="[
        { label: '发送记录', value: 'records' },
        { label: '消息模板', value: 'templates' },
      ]"
    />
    <WiCard v-if="tab === 'records'">
      <WiTable :columns="columns" :rows="messages as unknown as Record<string, unknown>[]" striped bordered paginator>
        <template #cell-status="{ value }">
          <WiTag
            :value="value === 'success' ? '成功' : value === 'failed' ? '失败' : '排队中'"
            :severity="value === 'success' ? 'success' : value === 'failed' ? 'danger' : 'warn'"
          />
        </template>
      </WiTable>
    </WiCard>
    <WiCard v-else title="模板管理">
      <p class="messages-page__desc">维护站内信、短信与邮件模板。</p>
      <WiButton>新建模板</WiButton>
    </WiCard>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.messages-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.messages-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.messages-page__desc {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
}
</style>
