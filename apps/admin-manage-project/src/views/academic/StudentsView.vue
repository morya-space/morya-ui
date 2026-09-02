<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiInput, WiSelect, WiSpace, WiTag, useToast } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { students } from '@/mock'

const toast = useToast()
const keyword = ref('')
const grade = ref<string | undefined>()
const status = ref<string | undefined>()
const selection = ref<unknown[] | null>(null)
const visibleColumns = ref(['name', 'studentNo', 'grade', 'className', 'status', 'enrolledAt'])

const allColumns = [
  { key: 'name', label: '姓名' },
  { key: 'studentNo', label: '学号' },
  { key: 'grade', label: '年级' },
  { key: 'className', label: '班级' },
  { key: 'status', label: '状态' },
  { key: 'enrolledAt', label: '入学日期' },
  { key: 'actions', label: '操作', width: 140 },
]

const columns = computed(() => allColumns.filter((col) => visibleColumns.value.includes(col.key) || col.key === 'actions'))

const rows = computed(() =>
  students.filter((row) => {
    const matchKeyword = !keyword.value || row.name.includes(keyword.value) || row.studentNo.includes(keyword.value)
    const matchGrade = !grade.value || row.grade === grade.value
    const matchStatus = !status.value || row.status === status.value
    return matchKeyword && matchGrade && matchStatus
  }),
)

function resetFilters() {
  keyword.value = ''
  grade.value = undefined
  status.value = undefined
}

function toggleColumn(key: string) {
  if (key === 'actions') return
  if (visibleColumns.value.includes(key)) {
    visibleColumns.value = visibleColumns.value.filter((item) => item !== key)
  } else {
    visibleColumns.value = [...visibleColumns.value, key]
  }
}
</script>

<template>
  <ListPageTemplate
    v-model:selection="selection"
    title="学生管理"
    table-label="学生列表"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    :rows-per-page="5"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="姓名 / 学号" clearable style="width: 12rem" />
        <WiSelect
          v-model="grade"
          :options="[{ label: '高一', value: '高一' }, { label: '高二', value: '高二' }, { label: '高三', value: '高三' }]"
          placeholder="年级"
          clearable
          style="width: 8rem"
        />
        <WiSelect
          v-model="status"
          :options="[{ label: '在读', value: 'active' }, { label: '休学', value: 'leave' }, { label: '毕业', value: 'graduated' }]"
          placeholder="状态"
          clearable
          style="width: 8rem"
        />
        <WiButton>查询</WiButton>
        <WiButton severity="secondary" @click="resetFilters">重置</WiButton>
      </WiSpace>
      <WiSpace wrap class="students-page__columns">
        <span class="students-page__columns-label">显示列</span>
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
      <WiButton severity="secondary" @click="toast.add({ severity: 'info', summary: '演示：CSV 导出已触发' })">
        导出 CSV
      </WiButton>
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? '在读' : value === 'leave' ? '休学' : '毕业'"
        :severity="value === 'active' ? 'success' : value === 'leave' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">编辑</WiButton>
        <WiButton size="small" severity="danger">删除</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
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
