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
import type { UserRecord } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.users
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<UserRecord>()

const form = reactive({
  name: '',
  email: '',
  role: '班主任',
  status: 'active' as UserRecord['status'],
  lastLogin: '-',
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', email: '', role: '班主任', status: 'active', lastLogin: '-' })
})

const columns = computed(() => [
  { key: 'name', label: t('姓名', 'Name') },
  { key: 'email', label: t('邮箱', 'Email') },
  { key: 'role', label: t('角色', 'Role') },
  { key: 'status', label: t('状态', 'Status'), width: 88 },
  { key: 'lastLogin', label: t('最近登录', 'Last login'), width: 140 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建用户', 'New user') : t('编辑用户', 'Edit user'),
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

function onDeleteRow(row: UserRecord) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('用户管理', 'Users')"
    :table-label="t('用户列表', 'User list')"
    :columns="columns"
    :rows="store.items.value"
    @create="openCreate()"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? t('正常', 'Active') : t('停用', 'Inactive')"
        :severity="value === 'active' ? 'success' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as UserRecord)" @delete="onDeleteRow(row as UserRecord)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('姓名', 'Name')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('邮箱', 'Email')" name="email" required>
      <WiInput v-model="form.email" type="email" fluid />
    </WiFormItem>
    <WiFormItem :label="t('角色', 'Role')" name="role" required>
      <WiInput v-model="form.role" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('正常', 'Active'), value: 'active' },
          { label: t('停用', 'Inactive'), value: 'inactive' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
