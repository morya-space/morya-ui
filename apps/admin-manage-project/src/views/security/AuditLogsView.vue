<script setup lang="ts">
import { computed } from 'vue'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { useLocale } from '@/composables/useLocale'
import { stores } from '@/mock/store'

const { t } = useLocale()

const columns = computed(() => [
  { key: 'operator', label: t('操作人', 'Operator') },
  { key: 'action', label: t('动作', 'Action'), width: 88 },
  { key: 'target', label: t('对象', 'Target') },
  { key: 'ip', label: 'IP', width: 120 },
  { key: 'time', label: t('时间', 'Time'), width: 140 },
])
</script>

<template>
  <ListPageTemplate
    :title="t('操作日志', 'Audit logs')"
    :table-label="t('审计日志列表', 'Audit log list')"
    :columns="columns"
    :rows="stores.auditLogs.items.value"
    :paginator="false"
    :show-create="false"
  />
</template>
