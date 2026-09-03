<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiConfirmDialog, WiSpace } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useLocale } from '@/composables/useLocale'
import type { RecycleItem } from '@/mock'
import { purgeRecycleItem, restoreFromRecycle, stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.recycleBin
const purgeOpen = ref(false)
const purgingRow = ref<RecycleItem | null>(null)

const columns = computed(() => [
  { key: 'name', label: t('名称', 'Name') },
  { key: 'module', label: t('模块', 'Module'), width: 112 },
  { key: 'deletedBy', label: t('删除人', 'Deleted by'), width: 96 },
  { key: 'deletedAt', label: t('删除时间', 'Deleted at'), width: 112 },
  { key: 'expireAt', label: t('过期时间', 'Expires'), width: 112 },
  { key: 'actions', label: t('操作', 'Actions'), width: 160 },
])

function restore(row: RecycleItem) {
  const ok = restoreFromRecycle(row)
  feedback.notify(
    ok ? t('已恢复', 'Restored') : t('无法恢复', 'Restore failed'),
    row.name,
    ok ? 'success' : 'warn',
  )
}

function askPurge(row: RecycleItem) {
  purgingRow.value = row
  purgeOpen.value = true
}

function confirmPurge() {
  if (!purgingRow.value) return
  purgeRecycleItem(purgingRow.value.id)
  feedback.notify(t('已彻底删除', 'Permanently deleted'), purgingRow.value.name)
  purgingRow.value = null
  purgeOpen.value = false
}
</script>

<template>
  <ListPageTemplate
    :title="t('回收站', 'Recycle bin')"
    :table-label="t('回收站列表', 'Recycle bin list')"
    :columns="columns"
    :rows="store.items.value"
    :paginator="false"
    :show-create="false"
  >
    <template #cell-actions="{ row }">
      <WiSpace>
        <WiButton size="small" @click="restore(row as RecycleItem)">
          {{ t('恢复', 'Restore') }}
        </WiButton>
        <WiButton size="small" severity="danger" @click="askPurge(row as RecycleItem)">
          {{ t('彻底删除', 'Delete forever') }}
        </WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>

  <WiConfirmDialog
    v-model="purgeOpen"
    type="error"
    :header="t('确认彻底删除', 'Confirm permanent delete')"
    :message="t('此操作不可恢复，确定继续？', 'This action cannot be undone. Continue?')"
    @accept="confirmPurge"
  />
</template>
