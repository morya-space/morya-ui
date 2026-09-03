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
import type { Course } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.courses
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<Course>()
const keyword = ref('')
const category = ref<string | undefined>()

const form = reactive({
  name: '',
  category: '理科',
  credits: 2,
  teacher: '',
  enrolled: 0,
  capacity: 40,
  status: 'open' as Course['status'],
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', category: '理科', credits: 2, teacher: '', enrolled: 0, capacity: 40, status: 'open' })
})

const columns = computed(() => [
  { key: 'name', label: t('课程名称', 'Course') },
  { key: 'category', label: t('类别', 'Category') },
  { key: 'credits', label: t('学分', 'Credits'), width: 72 },
  { key: 'teacher', label: t('任课教师', 'Teacher') },
  { key: 'enrolled', label: t('已选/容量', 'Enrolled'), width: 112 },
  { key: 'status', label: t('状态', 'Status'), width: 88 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const rows = computed(() =>
  store.items.value.filter((row) => {
    const matchKeyword = !keyword.value || row.name.includes(keyword.value)
    const matchCategory = !category.value || row.category === category.value
    return matchKeyword && matchCategory
  }),
)

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建课程', 'New course') : t('编辑课程', 'Edit course'),
)

function resetFilters() {
  keyword.value = ''
  category.value = undefined
}

function saveForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  const payloadData = {
    ...form,
    status: form.enrolled >= form.capacity ? 'full' : form.status,
  }
  if (mode.value === 'create') {
    store.create(payloadData)
    feedback.ok(t('已创建', 'Created'))
  } else if (editingRow.value) {
    store.update(editingRow.value.id, payloadData)
    feedback.ok(t('已更新', 'Updated'))
  }
  closeDialog()
}

function onDeleteRow(row: Course) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('课程管理', 'Courses')"
    :table-label="t('课程列表', 'Course list')"
    :columns="columns"
    :rows="rows"
    @create="openCreate()"
  >
    <template #filters>
      <ListFiltersBar @search="() => {}" @reset="resetFilters">
        <ListFilterField size="md">
          <WiInput v-model="keyword" :placeholder="t('课程名称', 'Course name')" clearable />
        </ListFilterField>
        <ListFilterField size="sm">
          <WiSelect
            v-model="category"
            :options="[
              { label: t('理科', 'Science'), value: '理科' },
              { label: t('文科', 'Liberal arts'), value: '文科' },
              { label: t('实验', 'Lab'), value: '实验' },
            ]"
            :placeholder="t('类别', 'Category')"
            clearable
          />
        </ListFilterField>
      </ListFiltersBar>
    </template>

    <template #cell-enrolled="{ row }">
      {{ row.enrolled }} / {{ row.capacity }}
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'open' ? t('开放', 'Open') : value === 'full' ? t('已满', 'Full') : t('关闭', 'Closed')"
        :severity="value === 'open' ? 'success' : value === 'full' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as Course)" @delete="onDeleteRow(row as Course)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('课程名称', 'Course')" name="name" required>
      <WiInput v-model="form.name" fluid />
    </WiFormItem>
    <WiFormItem :label="t('类别', 'Category')" name="category" required>
      <WiInput v-model="form.category" fluid />
    </WiFormItem>
    <WiFormItem :label="t('学分', 'Credits')" name="credits">
      <WiInputNumber v-model="form.credits" :min="1" :max="10" fluid />
    </WiFormItem>
    <WiFormItem :label="t('任课教师', 'Teacher')" name="teacher" required>
      <WiInput v-model="form.teacher" fluid />
    </WiFormItem>
    <WiFormItem :label="t('容量', 'Capacity')" name="capacity">
      <WiInputNumber v-model="form.capacity" :min="1" fluid />
    </WiFormItem>
    <WiFormItem :label="t('状态', 'Status')" name="status">
      <WiSelect
        v-model="form.status"
        :options="[
          { label: t('开放', 'Open'), value: 'open' },
          { label: t('已满', 'Full'), value: 'full' },
          { label: t('关闭', 'Closed'), value: 'closed' },
        ]"
        fluid
      />
    </WiFormItem>
  </RecordFormDialog>
</template>
