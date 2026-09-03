<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  WiFormItem,
  WiInput,
  WiInputNumber,
  WiSelect,
} from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import ListRowActions from '@/components/ListRowActions.vue'
import RecordFormDialog from '@/components/RecordFormDialog.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useCrudDialog } from '@/composables/useCrudDialog'
import { useLocale } from '@/composables/useLocale'
import type { ClassGroup } from '@/mock'
import { stores } from '@/mock/store'

const feedback = useActionFeedback()
const { t } = useLocale()
const store = stores.classGroups
const { dialogOpen, mode, editingRow, openCreate, openEdit, closeDialog } = useCrudDialog<ClassGroup>()

const form = reactive({
  name: '',
  grade: '高一',
  headTeacher: '',
  students: 0,
  room: '',
})

watch(dialogOpen, (open) => {
  if (!open) return
  if (mode.value === 'edit' && editingRow.value) Object.assign(form, editingRow.value)
  else Object.assign(form, { name: '', grade: '高一', headTeacher: '', students: 0, room: '' })
})

const columns = computed(() => [
  { key: 'name', label: t('班级', 'Class') },
  { key: 'grade', label: t('年级', 'Grade'), width: 88 },
  { key: 'headTeacher', label: t('班主任', 'Head teacher') },
  { key: 'students', label: t('人数', 'Students'), width: 72 },
  { key: 'room', label: t('教室', 'Room'), width: 88 },
  { key: 'actions', label: t('操作', 'Actions'), width: 140 },
])

const dialogTitle = computed(() =>
  mode.value === 'create' ? t('新建班级', 'New class') : t('编辑班级', 'Edit class'),
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

function onDeleteRow(row: ClassGroup) {
  store.softRemove(row, row.name)
  feedback.info(t('已移入回收站', 'Moved to recycle bin'))
}
</script>

<template>
  <ListPageTemplate
    :title="t('班级管理', 'Classes')"
    :table-label="t('班级列表', 'Class list')"
    :columns="columns"
    :rows="store.items.value"
    @create="openCreate()"
  >
    <template #cell-actions="{ row }">
      <ListRowActions @edit="openEdit(row as ClassGroup)" @delete="onDeleteRow(row as ClassGroup)" />
    </template>
  </ListPageTemplate>

  <RecordFormDialog v-model="dialogOpen" :title="dialogTitle" @submit="saveForm">
    <WiFormItem :label="t('班级名称', 'Class name')" name="name" required>
      <WiInput v-model="form.name" fluid />
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
    <WiFormItem :label="t('班主任', 'Head teacher')" name="headTeacher" required>
      <WiInput v-model="form.headTeacher" fluid />
    </WiFormItem>
    <WiFormItem :label="t('人数', 'Students')" name="students">
      <WiInputNumber v-model="form.students" :min="0" fluid />
    </WiFormItem>
    <WiFormItem :label="t('教室', 'Room')" name="room">
      <WiInput v-model="form.room" fluid />
    </WiFormItem>
  </RecordFormDialog>
</template>
