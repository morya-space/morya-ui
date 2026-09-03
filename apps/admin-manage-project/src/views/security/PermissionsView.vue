<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  WiFormItem,
  WiInput,
  WiSelect,
  WiTag,
} from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import ListRowActions from '@/components/ListRowActions.vue'
import RecordFormDialog from '@/components/RecordFormDialog.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useCrudDialog } from '@/composables/useCrudDialog'
import { useLocale } from '@/composables/useLocale'
import type { PermissionNode } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.permissions
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<PermissionNode>()

const form = reactive({
  name: '',
  code: '',
  type: 'menu' as PermissionNode['type'],
  module: '',
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', code: '', type: 'menu', module: '' })
})

const columns = computed(() => [
  { key: 'name', label: t('权限名称', 'Permission') },
  { key: 'code', label: t('标识', 'Code') },
  { key: 'type', label: t('类型', 'Type'), width: 88 },
  { key: 'module', label: t('模块', 'Module'), width: 96 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建权限', 'New permission') : t('编辑权限', 'Edit permission'),
)

function typeLabel(value: unknown) {
  if (value === 'menu') return t('菜单', 'Menu')
  if (value === 'button') return t('按钮', 'Button')
  return t('接口', 'API')
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

function onDeleteRow(row: PermissionNode) {
  store.remove(row.id)
  feedback.ok(t('已删除', 'Deleted'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('权限清单', 'Permissions')"
    :table-label="t('权限列表', 'Permission list')"
    :columns="columns"
    :rows="store.items.value"
    :paginator="false"
    @create="openCreate()"
  >
    <template #cell-type="{ value }">
      <WiTag
        :value="typeLabel(value)"
        :severity="value === 'menu' ? 'info' : value === 'button' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as PermissionNode)" @delete="onDeleteRow(row as PermissionNode)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('权限名称', 'Permission')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('标识', 'Code')" name="code" required>
      <WiInput v-model="form.code" fluid />
    </WiFormItem>
    <WiFormItem :label="t('类型', 'Type')" name="type" required>
      <WiSelect
        v-model="form.type"
        :options="[
          { label: t('菜单', 'Menu'), value: 'menu' },
          { label: t('按钮', 'Button'), value: 'button' },
          { label: t('接口', 'API'), value: 'api' },
        ]"
        fluid
      />
    </WiFormItem>
    <WiFormItem :label="t('模块', 'Module')" name="module" required>
      <WiInput v-model="form.module" fluid />
    </WiFormItem>
  </RecordFormDialog>
</template>
