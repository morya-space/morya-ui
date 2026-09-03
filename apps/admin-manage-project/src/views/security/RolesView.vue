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
import type { RoleRecord } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.roles
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<RoleRecord>()

const form = reactive({
  name: '',
  code: '',
  users: 0,
  permissions: '',
  status: 'active' as RoleRecord['status'],
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', code: '', users: 0, permissions: '', status: 'active' })
})

const columns = computed(() => [
  { key: 'name', label: t('角色名称', 'Role') },
  { key: 'code', label: t('编码', 'Code') },
  { key: 'users', label: t('用户数', 'Users'), width: 88 },
  { key: 'permissions', label: t('权限范围', 'Permissions') },
  { key: 'status', label: t('状态', 'Status'), width: 88 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建角色', 'New role') : t('编辑角色', 'Edit role'),
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

function onDeleteRow(row: RoleRecord) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('角色管理', 'Roles')"
    :table-label="t('角色列表', 'Role list')"
    :columns="columns"
    :rows="store.items.value"
    @create="openCreate()"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? t('启用', 'Active') : t('停用', 'Disabled')"
        :severity="value === 'active' ? 'success' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as RoleRecord)" @delete="onDeleteRow(row as RoleRecord)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('角色名称', 'Role')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('编码', 'Code')" name="code" required>
      <WiInput v-model="form.code" fluid />
    </WiFormItem>
    <WiFormItem :label="t('用户数', 'Users')" name="users">
      <WiInputNumber v-model="form.users" :min="0" fluid />
    </WiFormItem>
    <WiFormItem :label="t('权限范围', 'Permissions')" name="permissions" required>
      <WiInput v-model="form.permissions" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('启用', 'Active'), value: 'active' },
          { label: t('停用', 'Disabled'), value: 'disabled' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
