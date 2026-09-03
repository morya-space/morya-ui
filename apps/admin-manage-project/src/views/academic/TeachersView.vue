<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  WiFormItem,
  WiInput,
  WiInputNumber,
  WiSelect,
  WiTag,
} from '@well-insight/ui'
import ListFilterField from '@/components/ListFilterField.vue'
import ListFiltersBar from '@/components/ListFiltersBar.vue'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import ListRowActions from '@/components/ListRowActions.vue'
import RecordFormDialog from '@/components/RecordFormDialog.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useCrudDialog } from '@/composables/useCrudDialog'
import { useLocale } from '@/composables/useLocale'
import type { Teacher } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.teachers
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<Teacher>()
const keyword = ref('')

const form = reactive({
  name: '',
  title: '',
  department: '',
  courses: 0,
  status: 'active' as Teacher['status'],
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', title: '', department: '', courses: 0, status: 'active' })
})

const columns = computed(() => [
  { key: 'name', label: t('姓名', 'Name') },
  { key: 'title', label: t('职称', 'Title') },
  { key: 'department', label: t('院系', 'Department') },
  { key: 'courses', label: t('课程数', 'Courses'), width: 88 },
  { key: 'status', label: t('状态', 'Status'), width: 88 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const rows = computed(() =>
  store.items.value.filter((row) => !keyword.value || row.name.includes(keyword.value)),
)

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建教师', 'New teacher') : t('编辑教师', 'Edit teacher'),
)

function resetFilters() {
  keyword.value = ''
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

function onDeleteRow(row: Teacher) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('教师管理', 'Teachers')"
    :table-label="t('教师列表', 'Teacher list')"
    :columns="columns"
    :rows="rows"
    @create="openCreate()"
  >
    <template #filters>
      <ListFiltersBar @search="() => {}" @reset="resetFilters">
        <ListFilterField size="md">
          <WiInput v-model="keyword" :placeholder="t('姓名关键词', 'Search by name')" clearable />
        </ListFilterField>
      </ListFiltersBar>
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? t('在职', 'Active') : t('离职', 'Inactive')"
        :severity="value === 'active' ? 'success' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as Teacher)" @delete="onDeleteRow(row as Teacher)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('姓名', 'Name')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('职称', 'Title')" name="title" required>
      <WiInput v-model="form.title" fluid />
    </WiFormItem>
    <WiFormItem :label="t('院系', 'Department')" name="department" required>
      <WiInput v-model="form.department" fluid />
    </WiFormItem>
    <WiFormItem :label="t('课程数', 'Courses')" name="courses">
      <WiInputNumber v-model="form.courses" :min="0" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('在职', 'Active'), value: 'active' },
          { label: t('离职', 'Inactive'), value: 'inactive' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
