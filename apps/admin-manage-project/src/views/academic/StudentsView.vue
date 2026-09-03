<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  WiButton,
  WiConfirmDialog,
  WiFormItem,
  WiInput,
  WiSelect,
  WiSpace,
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
import type { Student } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.students
const {
  dialogOpen,
  mode,
  editingRow,
  openCreate,
  openEdit,
  closeDialog,
} = useCrudDialog<Student>()

const keyword = ref('')
const grade = ref<string | undefined>()
const status = ref<string | undefined>()
const selection = ref<unknown[] | null>(null)
const visibleColumns = ref(['name', 'studentNo', 'grade', 'className', 'status', 'enrolledAt'])
const bulkDeleteOpen = ref(false)

const form = reactive({
  name: '',
  studentNo: '',
  grade: '高一',
  className: '',
  status: 'active' as Student['status'],
  enrolledAt: new Date().toISOString().slice(0, 10),
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) {
    Object.assign(form, editingRow.value)
  } else {
    Object.assign(form, {
      name: '',
      studentNo: '',
      grade: '高一',
      className: '',
      status: 'active',
      enrolledAt: new Date().toISOString().slice(0, 10),
    })
  }
})

const allColumns = computed(() => [
  { key: 'name', label: t('姓名', 'Name') },
  { key: 'studentNo', label: t('学号', 'Student ID') },
  { key: 'grade', label: t('年级', 'Grade') },
  { key: 'className', label: t('班级', 'Class') },
  { key: 'status', label: t('状态', 'Status') },
  { key: 'enrolledAt', label: t('入学日期', 'Enrolled') },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const columns = computed(() =>
  allColumns.value.filter((col) => visibleColumns.value.includes(col.key) || col.key === 'actions'),
)

const rows = computed(() =>
  store.items.value.filter((row) => {
    const matchKeyword = !keyword.value || row.name.includes(keyword.value) || row.studentNo.includes(keyword.value)
    const matchGrade = !grade.value || row.grade === grade.value
    const matchStatus = !status.value || row.status === status.value
    return matchKeyword && matchGrade && matchStatus
  }),
)

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建学生', 'New student') : t('编辑学生', 'Edit student'),
)

function resetFilters() {
  keyword.value = ''
  grade.value = undefined
  status.value = undefined
}

function toggleColumn(key: string) {
  if (key === 'actions') return
  visibleColumns.value = visibleColumns.value.includes(key)
    ? visibleColumns.value.filter((item) => item !== key)
    : [...visibleColumns.value, key]
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

function onDeleteRow(row: Student) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}

function confirmBulkDelete() {
  const selected = (selection.value ?? []) as Student[]
  for (const row of selected) store.softRemove(row, row.name)
  selection.value = null
  bulkDeleteOpen.value = false
  feedback.info(t('已批量移入回收站', 'Bulk moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    v-model:selection="selection"
    :title="t('学生管理', 'Students')"
    :table-label="t('学生列表', 'Student list')"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    :rows-per-page="5"
    @create="openCreate()"
  >
    <template #filters>
      <ListFiltersBar @search="() => {}" @reset="resetFilters">
        <ListFilterField size="md">
          <WiInput v-model="keyword" :placeholder="t('姓名 / 学号', 'Name / ID')" clearable />
        </ListFilterField>
        <ListFilterField size="sm">
          <WiSelect
            v-model="grade"
            :options="[
              { label: t('高一', 'Grade 10'), value: '高一' },
              { label: t('高二', 'Grade 11'), value: '高二' },
              { label: t('高三', 'Grade 12'), value: '高三' },
            ]"
            :placeholder="t('年级', 'Grade')"
            clearable
          />
        </ListFilterField>
        <ListFilterField size="sm">
          <WiSelect
            v-model="status"
            :options="[
              { label: t('在读', 'Active'), value: 'active' },
              { label: t('休学', 'Leave'), value: 'leave' },
              { label: t('毕业', 'Graduated'), value: 'graduated' },
            ]"
            :placeholder="t('状态', 'Status')"
            clearable
          />
        </ListFilterField>
      </ListFiltersBar>
      <WiSpace wrap class="students-page__columns">
        <span class="students-page__columns-label">{{ t('显示列', 'Columns') }}</span>
        <WiButton
          v-for="col in allColumns.filter((c) => c.key !== 'actions')"
          :key="col.key"
          size="small"
          :severity="visibleColumns.includes(col.key) ? undefined : 'secondary'"
          @click="toggleColumn(col.key)"
        >
          {{ col.label }}
        </WiButton>
      </WiSpace>
    </template>

    <template #actions>
      <WiButton
        v-if="selection?.length"
        severity="danger"
        @click="bulkDeleteOpen = true"
      >
        {{ t('批量删除', 'Bulk delete') }} ({{ selection.length }})
      </WiButton>
      <WiButton
        severity="secondary"
        @click="feedback.info(t('演示：CSV 导出已触发', 'Demo: CSV export triggered'))"
      >
        {{ t('导出 CSV', 'Export CSV') }}
      </WiButton>
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? t('在读', 'Active') : value === 'leave' ? t('休学', 'Leave') : t('毕业', 'Graduated')"
        :severity="value === 'active' ? 'success' : value === 'leave' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions
        @edit="openEdit(row as Student)"
        @delete="onDeleteRow(row as Student)"
      />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('姓名', 'Name')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('学号', 'Student ID')" name="studentNo" required>
      <WiInput v-model="form.studentNo" fluid />
    </WiFormItem>
    <WiFormItem :label="t('年级', 'Grade')" name="grade" required>
      <WiSelect
        v-model="form.grade"
        :options="[
          { label: t('高一', 'Grade 10'), value: '高一' },
          { label: t('高二', 'Grade 11'), value: '高二' },
          { label: t('高三', 'Grade 12'), value: '高三' },
        ]"
        fluid
      />
    </WiFormItem>
    <WiFormItem :label="t('班级', 'Class')" name="className" required>
      <WiInput v-model="form.className" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status" required>
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('在读', 'Active'), value: 'active' },
          { label: t('休学', 'Leave'), value: 'leave' },
          { label: t('毕业', 'Graduated'), value: 'graduated' },
        ]"
        fluid
      />
    </WiFormItem>
    <WiFormItem :label="t('入学日期', 'Enrolled')" name="enrolledAt">
      <WiInput v-model="form.enrolledAt" fluid />
    </WiFormItem>
  </RecordFormDialog>

  <WiConfirmDialog
    v-model="bulkDeleteOpen"
    type="error"
    :header="t('确认批量删除', 'Confirm bulk delete')"
    :message="t('选中的记录将移入回收站，确定继续？', 'Selected rows will move to recycle bin. Continue?')"
    @accept="confirmBulkDelete"
  />
</template>

<style scoped>
.students-page__columns {
  margin-top: var(--wi-space-3);
}

.students-page__columns-label {
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
