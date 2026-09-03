<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  WiFormItem,
  WiInput,
  WiInputNumber,
  WiSelect,
  WiTag,
} from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import ListRowActions from '@/components/ListRowActions.vue'
import RecordFormDialog from '@/components/RecordFormDialog.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useCrudDialog } from '@/composables/useCrudDialog'
import { useLocale } from '@/composables/useLocale'
import type { DictEntry } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.dictionaries
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<DictEntry>()

const form = reactive({
  type: '',
  label: '',
  value: '',
  sort: 1,
  status: 'enabled' as DictEntry['status'],
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { type: '', label: '', value: '', sort: 1, status: 'enabled' })
})

const columns = computed(() => [
  { key: 'type', label: t('字典类型', 'Type'), width: 140 },
  { key: 'label', label: t('显示名', 'Label') },
  { key: 'value', label: t('值', 'Value'), width: 120 },
  { key: 'sort', label: t('排序', 'Sort'), width: 72 },
  { key: 'status', label: t('状态', 'Status'), width: 88 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建字典项', 'New dictionary entry') : t('编辑字典项', 'Edit dictionary entry'),
)

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

function onDeleteRow(row: DictEntry) {
  store.remove(row.id)
  feedback.ok(t('已删除', 'Deleted'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('字典管理', 'Dictionary')"
    :table-label="t('字典列表', 'Dictionary list')"
    :columns="columns"
    :rows="store.items.value"
    :paginator="false"
    @create="openCreate()"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'enabled' ? t('启用', 'Enabled') : t('停用', 'Disabled')"
        :severity="value === 'enabled' ? 'success' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as DictEntry)" @delete="onDeleteRow(row as DictEntry)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('字典类型', 'Type')" name="type" required>
      <WiInput v-model="form.type" fluid />
    </WiFormItem>
    <WiFormItem :label="t('显示名', 'Label')" name="label" required>
      <WiInput v-model="form.label" fluid />
    </WiFormItem>
    <WiFormItem :label="t('值', 'Value')" name="value" required>
      <WiInput v-model="form.value" fluid />
    </WiFormItem>
    <WiFormItem :label="t('排序', 'Sort')" name="sort">
      <WiInputNumber v-model="form.sort" :min="0" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('启用', 'Enabled'), value: 'enabled' },
          { label: t('停用', 'Disabled'), value: 'disabled' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
