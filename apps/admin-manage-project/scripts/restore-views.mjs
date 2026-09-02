import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

const files = {
  'views/academic/ClassesView.vue': `<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { classGroups } from '@/mock'

const columns = [
  { key: 'name', label: '\u73ed\u7ea7' },
  { key: 'grade', label: '\u5e74\u7ea7', width: 88 },
  { key: 'headTeacher', label: '\u73ed\u4e3b\u4efb' },
  { key: 'students', label: '\u4eba\u6570', width: 72 },
  { key: 'room', label: '\u6559\u5ba4', width: 88 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="\u73ed\u7ea7\u7ba1\u7406"
    table-label="\u73ed\u7ea7\u5217\u8868"
    :columns="columns"
    :rows="classGroups"
  >
    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">\u82b1\u540d\u518c</WiButton>
        <WiButton size="small" severity="secondary">\u8bfe\u8868</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/academic/StudentsView.vue': `<script setup lang="ts">
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
  { key: 'name', label: '\u59d3\u540d' },
  { key: 'studentNo', label: '\u5b66\u53f7' },
  { key: 'grade', label: '\u5e74\u7ea7' },
  { key: 'className', label: '\u73ed\u7ea7' },
  { key: 'status', label: '\u72b6\u6001' },
  { key: 'enrolledAt', label: '\u5165\u5b66\u65e5\u671f' },
  { key: 'actions', label: '\u64cd\u4f5c', width: 140 },
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
    title="\u5b66\u751f\u7ba1\u7406"
    table-label="\u5b66\u751f\u5217\u8868"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    :rows-per-page="5"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="\u59d3\u540d / \u5b66\u53f7" clearable style="width: 12rem" />
        <WiSelect
          v-model="grade"
          :options="[{ label: '\u9ad8\u4e00', value: '\u9ad8\u4e00' }, { label: '\u9ad8\u4e8c', value: '\u9ad8\u4e8c' }, { label: '\u9ad8\u4e09', value: '\u9ad8\u4e09' }]"
          placeholder="\u5e74\u7ea7"
          clearable
          style="width: 8rem"
        />
        <WiSelect
          v-model="status"
          :options="[{ label: '\u5728\u8bfb', value: 'active' }, { label: '\u4f11\u5b66', value: 'leave' }, { label: '\u6bd5\u4e1a', value: 'graduated' }]"
          placeholder="\u72b6\u6001"
          clearable
          style="width: 8rem"
        />
        <WiButton>\u67e5\u8be2</WiButton>
        <WiButton severity="secondary" @click="resetFilters">\u91cd\u7f6e</WiButton>
      </WiSpace>
      <WiSpace wrap class="students-page__columns">
        <span class="students-page__columns-label">\u663e\u793a\u5217</span>
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
      <WiButton severity="secondary" @click="toast.add({ severity: 'info', summary: '\u6f14\u793a\uff1aCSV \u5bfc\u51fa\u5df2\u89e6\u53d1' })">
        \u5bfc\u51fa CSV
      </WiButton>
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'active' ? '\u5728\u8bfb' : value === 'leave' ? '\u4f11\u5b66' : '\u6bd5\u4e1a'"
        :severity="value === 'active' ? 'success' : value === 'leave' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">\u7f16\u8f91</WiButton>
        <WiButton size="small" severity="danger">\u5220\u9664</WiButton>
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
`,
  'views/academic/CoursesView.vue': `<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiInput, WiSelect, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { courses } from '@/mock'

const keyword = ref('')
const category = ref<string | undefined>()

const columns = [
  { key: 'name', label: '\u8bfe\u7a0b\u540d\u79f0' },
  { key: 'category', label: '\u7c7b\u522b' },
  { key: 'credits', label: '\u5b66\u5206', width: 72 },
  { key: 'teacher', label: '\u4efb\u8bfe\u6559\u5e08' },
  { key: 'enrolled', label: '\u5df2\u9009/\u5bb9\u91cf', width: 112 },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]

const rows = computed(() =>
  courses.filter((row) => {
    const matchKeyword = !keyword.value || row.name.includes(keyword.value)
    const matchCategory = !category.value || row.category === category.value
    return matchKeyword && matchCategory
  }),
)

function resetFilters() {
  keyword.value = ''
  category.value = undefined
}
</script>

<template>
  <ListPageTemplate
    title="\u8bfe\u7a0b\u7ba1\u7406"
    table-label="\u8bfe\u7a0b\u5217\u8868"
    :columns="columns"
    :rows="rows"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="\u8bfe\u7a0b\u540d\u79f0" clearable style="width: 12rem" />
        <WiSelect
          v-model="category"
          :options="[{ label: '\u7406\u79d1', value: '\u7406\u79d1' }, { label: '\u6587\u79d1', value: '\u6587\u79d1' }, { label: '\u5b9e\u9a8c', value: '\u5b9e\u9a8c' }]"
          placeholder="\u7c7b\u522b"
          clearable
          style="width: 8rem"
        />
        <WiButton>\u67e5\u8be2</WiButton>
        <WiButton severity="secondary" @click="resetFilters">\u91cd\u7f6e</WiButton>
      </WiSpace>
    </template>

    <template #cell-enrolled="{ row }">
      {{ row.enrolled }} / {{ row.capacity }}
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'open' ? '\u5f00\u653e' : value === 'full' ? '\u5df2\u6ee1' : '\u5173\u95ed'"
        :severity="value === 'open' ? 'success' : value === 'full' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions>
      <WiButton size="small" severity="secondary">\u7f16\u8f91</WiButton>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/academic/TeachersView.vue': `<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiInput, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { teachers } from '@/mock'

const keyword = ref('')

const columns = [
  { key: 'name', label: '\u59d3\u540d' },
  { key: 'title', label: '\u804c\u79f0' },
  { key: 'department', label: '\u9662\u7cfb' },
  { key: 'courses', label: '\u8bfe\u7a0b\u6570', width: 88 },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]

const rows = computed(() =>
  teachers.filter((row) => !keyword.value || row.name.includes(keyword.value)),
)

function resetFilters() {
  keyword.value = ''
}
</script>

<template>
  <ListPageTemplate
    title="\u6559\u5e08\u7ba1\u7406"
    table-label="\u6559\u5e08\u5217\u8868"
    :columns="columns"
    :rows="rows"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="\u59d3\u540d\u5173\u952e\u8bcd" clearable style="width: 12rem" />
        <WiButton>\u67e5\u8be2</WiButton>
        <WiButton severity="secondary" @click="resetFilters">\u91cd\u7f6e</WiButton>
      </WiSpace>
    </template>

    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '\u5728\u804c' : '\u79bb\u804c'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>

    <template #cell-actions>
      <WiButton size="small" severity="secondary">\u8be6\u60c5</WiButton>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/academic/BatchOpsView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiConfirmDialog,
  WiFileUpload,
  WiLayoutContent,
  WiProgressBar,
  WiSpace,
  WiTag,
  useToast,
} from '@well-insight/ui'

const toast = useToast()
const importing = ref(false)
const progress = ref(0)
const deleteOpen = ref(false)

async function simulateImport() {
  importing.value = true
  progress.value = 0
  for (let i = 1; i <= 5; i++) {
    await new Promise((r) => setTimeout(r, 300))
    progress.value = i * 20
  }
  importing.value = false
  toast.add({ severity: 'success', summary: '\u5bfc\u5165\u5b8c\u6210', detail: '\u6210\u529f 128 \u6761\uff0c\u5931\u8d25 2 \u6761', life: 3500 })
}

function confirmDelete() {
  deleteOpen.value = false
  toast.add({ severity: 'success', summary: '\u6279\u91cf\u5220\u9664\u5b8c\u6210', detail: '\u5df2\u9009 0 \u6761\u8bb0\u5f55\u672a\u53d8\u66f4', life: 3000 })
}
</script>

<template>
  <WiLayoutContent content-class="batch-ops">
    <header class="batch-ops__intro">
      <h1 class="batch-ops__title">\u6279\u91cf\u64cd\u4f5c</h1>
      <p class="batch-ops__desc">\u652f\u6301 Excel\u3001CSV \u5bfc\u5165\u5bfc\u51fa\u4e0e\u6279\u91cf\u5220\u9664\uff08\u6f14\u793a\uff09</p>
    </header>

    <div class="batch-ops__grid">
      <WiCard title="\u6279\u91cf\u5bfc\u5165" class="batch-ops__card">
        <p class="batch-ops__card-desc">\u4e0a\u4f20 Excel / CSV \u6279\u91cf\u5bfc\u5165\u5b66\u751f\u3001\u8bfe\u7a0b\u6216\u6210\u7ee9\u6570\u636e\u3002</p>
        <WiFileUpload mode="basic" accept=".xlsx,.csv" />
        <WiProgressBar v-if="importing || progress" :value="progress" />
        <WiButton :loading="importing" @click="simulateImport">\u5f00\u59cb\u5bfc\u5165</WiButton>
      </WiCard>

      <WiCard title="\u6279\u91cf\u5bfc\u51fa" class="batch-ops__card">
        <p class="batch-ops__card-desc">\u6309\u7b5b\u9009\u6761\u4ef6\u5bfc\u51fa\u5f53\u524d\u5217\u8868\u6570\u636e\u3002</p>
        <WiSpace wrap>
          <WiButton severity="secondary">\u5bfc\u51fa CSV</WiButton>
          <WiButton severity="secondary">\u5bfc\u51fa Excel</WiButton>
          <WiButton severity="secondary">\u751f\u6210 PDF \u62a5\u8868</WiButton>
        </WiSpace>
      </WiCard>

      <WiCard title="\u6279\u91cf\u5220\u9664" class="batch-ops__card">
        <p class="batch-ops__card-desc">\u5bf9\u5df2\u9009\u8bb0\u5f55\u6267\u884c\u6279\u91cf\u5220\u9664\uff0c\u5220\u9664\u540e\u53ef\u5728\u56de\u6536\u7ad9\u6062\u590d\u3002</p>
        <WiSpace wrap align="center">
          <WiTag value="\u5df2\u9009 0 \u6761" severity="info" />
          <WiButton severity="danger" @click="deleteOpen = true">\u6279\u91cf\u5220\u9664</WiButton>
        </WiSpace>
      </WiCard>
    </div>

    <WiConfirmDialog
      v-model="deleteOpen"
      header="\u786e\u8ba4\u6279\u91cf\u5220\u9664\uff1f"
      message="\u6b64\u64cd\u4f5c\u4e0d\u53ef\u64a4\u9500\uff0c\u786e\u5b9a\u8981\u5220\u9664\u5df2\u9009\u8bb0\u5f55\u5417\uff1f"
      accept-label="\u786e\u8ba4"
      reject-label="\u53d6\u6d88"
      accept-severity="danger"
      @accept="confirmDelete"
    />
  </WiLayoutContent>
</template>

<style scoped>
:deep(.batch-ops) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.batch-ops__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.batch-ops__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.batch-ops__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--wi-space-4);
}

.batch-ops__card {
  box-shadow: var(--wi-shadow-sm);
}

.batch-ops__card-desc {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
`,
  'views/academic/WorkflowView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiLayoutContent,
  WiProgressBar,
  WiStepper,
  WiTable,
  WiTag,
  WiTimeline,
} from '@well-insight/ui'
import { workflowTasks } from '@/mock'

const activeStep = ref(1)

const steps = [
  { label: '\u63d0\u4ea4\u7533\u8bf7', description: '\u6559\u5e08 / \u5b66\u751f' },
  { label: '\u6559\u52a1\u5ba1\u6838', description: '\u6559\u52a1' },
  { label: '\u9662\u7cfb\u5ba1\u6279', description: '\u9662\u957f' },
  { label: '\u5f52\u6863', description: '\u7cfb\u7edf' },
]

const columns = [
  { key: 'title', label: '\u6807\u9898' },
  { key: 'applicant', label: '\u7533\u8bf7\u4eba', width: 96 },
  { key: 'step', label: '\u5f53\u524d\u8282\u70b9', width: 112 },
  { key: 'status', label: '\u72b6\u6001', width: 96 },
  { key: 'updatedAt', label: '\u66f4\u65b0\u65f6\u95f4', width: 140 },
]

const timeline = [
  { content: '\u7533\u8bf7\u5df2\u63d0\u4ea4', date: '2026-09-02 09:00', severity: 'info' as const },
  { content: '\u6559\u52a1\u5ba1\u6838\u901a\u8fc7', date: '2026-09-02 10:15', severity: 'success' as const },
  { content: '\u7b49\u5f85\u9662\u7cfb\u5ba1\u6279', date: '\u5f85\u5b9a', severity: 'warn' as const },
]
</script>

<template>
  <WiLayoutContent content-class="workflow-page">
    <h1 class="workflow-page__title">\u5ba1\u6279\u6d41\u7a0b</h1>

    <WiCard title="\u6d41\u7a0b\u8fdb\u5ea6\u793a\u610f">
      <WiStepper v-model="activeStep" :steps="steps" />
      <WiProgressBar :value="((activeStep + 1) / steps.length) * 100" />
    </WiCard>

    <div class="workflow-page__split">
      <WiCard title="\u5f85\u529e\u5217\u8868">
        <WiTable :columns="columns" :rows="workflowTasks as unknown as Record<string, unknown>[]" striped bordered :paginator="false">
          <template #cell-status="{ value }">
            <WiTag
              :value="value === 'pending' ? '\u5f85\u5ba1\u6279' : value === 'approved' ? '\u5df2\u901a\u8fc7' : '\u5df2\u9a73\u56de'"
              :severity="value === 'pending' ? 'warn' : value === 'approved' ? 'success' : 'danger'"
            />
          </template>
        </WiTable>
      </WiCard>

      <WiCard title="\u6700\u8fd1\u52a8\u6001\uff08\u793a\u4f8b\uff09">
        <WiTimeline :value="timeline" />
        <WiButton style="margin-top: var(--wi-space-4)">\u5237\u65b0</WiButton>
      </WiCard>
    </div>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.workflow-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.workflow-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.workflow-page__split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--wi-space-4);
}

@media (max-width: 56rem) {
  .workflow-page__split {
    grid-template-columns: 1fr;
  }
}
</style>
`,
  'views/academic/EnrollmentFormView.vue': `<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiDatePicker,
  WiFileUpload,
  WiForm,
  WiFormItem,
  WiInput,
  WiLayoutContent,
  WiSelect,
  WiSpace,
  WiSwitch,
  WiTextarea,
  useToast,
} from '@well-insight/ui'
import { courses } from '@/mock'

const toast = useToast()
const submitting = ref(false)
const draftSaved = ref(false)

const model = reactive({
  studentName: '',
  studentNo: '',
  courseId: undefined as string | undefined,
  needMaterial: false,
  materialNote: '',
  reason: '',
  applyDate: null as string | null,
})

const courseOptions = courses.map((item) => ({ label: \`\${item.name} \u00b7 \${item.teacher}\`, value: item.id }))

const selectedCourse = computed(() => courses.find((item) => item.id === model.courseId))

function onCourseChange() {
  model.needMaterial = selectedCourse.value?.category === '\u5b9e\u9a8c'
}

function saveDraft() {
  localStorage.setItem('edu-enrollment-draft', JSON.stringify(model))
  draftSaved.value = true
  toast.add({ severity: 'info', summary: '\u8349\u7a3f\u5df2\u4fdd\u5b58', life: 2500 })
}

async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onSubmit()
}

async function onSubmit() {
  submitting.value = true
  await new Promise((r) => setTimeout(r, 500))
  submitting.value = false
  localStorage.removeItem('edu-enrollment-draft')
  toast.add({ severity: 'success', summary: '\u9009\u8bfe\u7533\u8bf7\u5df2\u63d0\u4ea4', detail: '\u8bf7\u7b49\u5f85\u6559\u52a1\u5ba1\u6838', life: 3000 })
}
</script>

<template>
  <WiLayoutContent content-class="enrollment-form">
    <header class="enrollment-form__intro">
      <h1>\u9009\u8bfe\u62a5\u540d\u8868</h1>
      <p>\u586b\u5199\u5b66\u751f\u4e0e\u8bfe\u7a0b\u4fe1\u606f\uff0c\u652f\u6301\u4e0a\u4f20\u5b9e\u9a8c\u7c7b\u8bfe\u7a0b\u6240\u9700\u6750\u6599\u3002</p>
    </header>

    <WiCard class="enrollment-form__card">
      <WiForm @submit="onSubmitForm">
        <WiFormItem label="\u5b66\u751f\u59d3\u540d" name="studentName" required>
          <WiInput v-model="model.studentName" fluid />
        </WiFormItem>
        <WiFormItem label="\u5b66\u53f7" name="studentNo" required>
          <WiInput v-model="model.studentNo" fluid />
        </WiFormItem>
        <WiFormItem label="\u7533\u8bf7\u8bfe\u7a0b" name="courseId" required>
          <WiSelect
            v-model="model.courseId"
            :options="courseOptions"
            placeholder="\u8bf7\u9009\u62e9\u8bfe\u7a0b"
            fluid
            @update:model-value="onCourseChange"
          />
        </WiFormItem>

        <WiFormItem v-if="model.needMaterial" label="\u4e0a\u4f20\u6750\u6599" name="material">
          <WiFileUpload mode="basic" accept=".pdf,.jpg,.png" />
          <WiTextarea v-model="model.materialNote" :rows="2" placeholder="\u6750\u6599\u8bf4\u660e\uff08\u53ef\u9009\uff09" fluid />
        </WiFormItem>

        <WiFormItem label="\u7533\u8bf7\u65e5\u671f" name="applyDate">
          <WiDatePicker v-model="model.applyDate" fluid />
        </WiFormItem>

        <WiFormItem label="\u7533\u8bf7\u7406\u7531" name="reason">
          <WiTextarea v-model="model.reason" :rows="4" fluid />
        </WiFormItem>

        <WiFormItem label="\u901a\u77e5\u5bb6\u957f" name="notify">
          <WiSwitch :model-value="true" />
        </WiFormItem>

        <footer class="enrollment-form__actions">
          <WiSpace>
            <WiButton native-type="submit" :loading="submitting">\u63d0\u4ea4\u7533\u8bf7</WiButton>
            <WiButton severity="secondary" @click="saveDraft">\u4fdd\u5b58\u8349\u7a3f</WiButton>
            <WiButton severity="secondary">\u53d6\u6d88</WiButton>
          </WiSpace>
          <p v-if="draftSaved" class="enrollment-form__draft-hint">\u8349\u7a3f\u5df2\u4fdd\u5b58\u81f3 localStorage</p>
        </footer>
      </WiForm>
    </WiCard>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.enrollment-form) {
  padding: var(--wi-space-6);
  max-width: 42rem;
}

.enrollment-form__intro h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.enrollment-form__intro p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.enrollment-form__card {
  box-shadow: var(--wi-shadow-sm);
}

.enrollment-form__actions {
  margin-top: var(--wi-space-4);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}

.enrollment-form__draft-hint {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
`,
  'views/dashboard/DashboardView.vue': `<script setup lang="ts">
import type { IconName } from '@well-insight/ui'
import {
  WiCard,
  WiGrid,
  WiGridItem,
  WiIcon,
  WiLayoutContent,
  WiSpace,
  WiTable,
  WiTag,
} from '@well-insight/ui'
import {
  courses,
  dashboardStats,
  enrollmentTrend,
  gradeDistribution,
  workflowTasks,
} from '@/mock'

const stats: Array<{ label: string; value: string; trend: string; icon: IconName }> = [
  { label: '\u5728\u6821\u5b66\u751f', value: dashboardStats.students.toLocaleString(), trend: '+3.2%', icon: 'user' },
  { label: '\u5728\u804c\u6559\u5e08', value: String(dashboardStats.teachers), trend: '+1', icon: 'user' },
  { label: '\u5f00\u8bbe\u8bfe\u7a0b', value: String(dashboardStats.courses), trend: '+6', icon: 'star' },
  { label: '\u9009\u8bfe\u5b8c\u6210\u7387', value: \`\${dashboardStats.enrollmentRate}%\`, trend: '+2.1%', icon: 'sort' },
]

const recentColumns = [
  { key: 'title', label: '\u6807\u9898' },
  { key: 'applicant', label: '\u7533\u8bf7\u4eba', width: 96 },
  { key: 'status', label: '\u72b6\u6001', width: 96 },
]

const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))
</script>

<template>
  <WiLayoutContent content-class="dashboard">
    <h1 class="dashboard__title">\u4eea\u8868\u76d8</h1>

    <WiGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
      <WiGridItem v-for="item in stats" :key="item.label" :span="1">
        <WiCard class="dashboard__stat">
          <WiSpace align="center" justify="space-between">
            <div>
              <p class="dashboard__stat-label">{{ item.label }}</p>
              <p class="dashboard__stat-value">{{ item.value }}</p>
              <p class="dashboard__stat-trend">{{ item.trend }}</p>
            </div>
            <WiIcon :name="item.icon" size="lg" class="dashboard__stat-icon" aria-hidden="true" />
          </WiSpace>
        </WiCard>
      </WiGridItem>
    </WiGrid>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="\u8fd1 6 \u4e2a\u6708\u9009\u8bfe\u8d8b\u52bf">
          <div class="dashboard__bars" role="img" aria-label="\u9009\u8bfe\u8d8b\u52bf\u67f1\u72b6\u56fe">
            <div v-for="item in enrollmentTrend" :key="item.month" class="dashboard__bar-item">
              <div
                class="dashboard__bar"
                :style="{ height: \`\${(item.count / maxTrend) * 100}%\` }"
              />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="\u5e74\u7ea7\u4eba\u6570\u5206\u5e03">
          <ul class="dashboard__grades">
            <li v-for="item in gradeDistribution" :key="item.grade">
              <span>{{ item.grade }}</span>
              <strong>{{ item.count }}</strong>
            </li>
          </ul>
        </WiCard>
      </WiGridItem>
    </WiGrid>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="\u5f85\u529e\u5ba1\u6279">
          <WiTable
            :columns="recentColumns"
            :rows="workflowTasks as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            aria-label="\u5f85\u529e\u5ba1\u6279\u5217\u8868"
          >
            <template #cell-status="{ value }">
              <WiTag
                :value="value === 'pending' ? '\u5f85\u5ba1\u6279' : value === 'approved' ? '\u5df2\u901a\u8fc7' : '\u5df2\u9a73\u56de'"
                :severity="value === 'pending' ? 'warn' : value === 'approved' ? 'success' : 'danger'"
              />
            </template>
          </WiTable>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="\u70ed\u95e8\u8bfe\u7a0b">
          <WiTable
            :columns="[{ key: 'name', label: '\u8bfe\u7a0b' }, { key: 'enrolled', label: '\u4eba\u6570', width: 72 }]"
            :rows="courses.slice(0, 4) as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            aria-label="\u70ed\u95e8\u8bfe\u7a0b\u5217\u8868"
          />
        </WiCard>
      </WiGridItem>
    </WiGrid>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.dashboard) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-6);
}

.dashboard__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.dashboard__stat {
  box-shadow: var(--wi-shadow-sm);
}

.dashboard__stat-label {
  margin: 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.dashboard__stat-value {
  margin: var(--wi-space-1) 0;
  color: var(--wi-color-text);
  font-size: var(--wi-font-size-lg);
  font-weight: 700;
}

.dashboard__stat-trend {
  margin: 0;
  color: var(--wi-color-primary);
  font-size: var(--wi-font-size-sm);
}

.dashboard__stat-icon {
  color: var(--wi-color-primary);
  opacity: 0.85;
}

.dashboard__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--wi-space-3);
  min-height: 10rem;
  padding-top: var(--wi-space-2);
}

.dashboard__bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wi-space-2);
  height: 10rem;
  justify-content: flex-end;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-xs);
}

.dashboard__bar {
  width: 100%;
  max-width: 2.5rem;
  border-radius: var(--wi-radius-sm) var(--wi-radius-sm) 0 0;
  background: color-mix(in srgb, var(--wi-color-primary) 75%, transparent);
}

.dashboard__grades {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--wi-space-3);
}

.dashboard__grades li {
  display: flex;
  justify-content: space-between;
  padding: var(--wi-space-3);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}
</style>
`,
  'views/security/UsersView.vue': `<script setup lang="ts">
import { WiButton, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'

const rows = [
  { id: 'u1', name: '\u5f20\u7ba1\u7406\u5458', email: 'admin@educloud.cn', role: '\u8d85\u7ea7\u7ba1\u7406\u5458', status: 'active', lastLogin: '2026-09-02 08:30' },
  { id: 'u2', name: '\u674e\u8001\u5e08', email: 'li@educloud.cn', role: '\u6559\u52a1\u4e3b\u4efb', status: 'active', lastLogin: '2026-09-01 17:20' },
  { id: 'u3', name: '\u738b\u73ed\u4e3b\u4efb', email: 'wang@educloud.cn', role: '\u73ed\u4e3b\u4efb', status: 'inactive', lastLogin: '2026-08-28 09:10' },
]

const columns = [
  { key: 'name', label: '\u59d3\u540d' },
  { key: 'email', label: '\u90ae\u7bb1' },
  { key: 'role', label: '\u89d2\u8272' },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
  { key: 'lastLogin', label: '\u6700\u8fd1\u767b\u5f55', width: 140 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="\u7528\u6237\u7ba1\u7406"
    table-label="\u7528\u6237\u5217\u8868"
    :columns="columns"
    :rows="rows"
    :show-create="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '\u6b63\u5e38' : '\u505c\u7528'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>
    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">\u7f16\u8f91</WiButton>
        <WiButton size="small" severity="danger">\u7981\u7528</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/security/RolesView.vue': `<script setup lang="ts">
import { WiButton, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { roles } from '@/mock'

const columns = [
  { key: 'name', label: '\u89d2\u8272\u540d\u79f0' },
  { key: 'code', label: '\u7f16\u7801' },
  { key: 'users', label: '\u7528\u6237\u6570', width: 88 },
  { key: 'permissions', label: '\u6743\u9650\u8303\u56f4' },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="\u89d2\u8272\u7ba1\u7406"
    table-label="\u89d2\u8272\u5217\u8868"
    :columns="columns"
    :rows="roles"
    :show-create="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '\u542f\u7528' : '\u505c\u7528'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>
    <template #cell-actions>
      <WiButton size="small" severity="secondary">\u5206\u914d\u6743\u9650</WiButton>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/security/AuditLogsView.vue': `<script setup lang="ts">
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { auditLogs } from '@/mock'

const columns = [
  { key: 'operator', label: '\u64cd\u4f5c\u4eba' },
  { key: 'action', label: '\u52a8\u4f5c', width: 88 },
  { key: 'target', label: '\u5bf9\u8c61' },
  { key: 'ip', label: 'IP', width: 120 },
  { key: 'time', label: '\u65f6\u95f4', width: 140 },
]
</script>

<template>
  <ListPageTemplate
    title="\u5ba1\u8ba1\u65e5\u5fd7"
    table-label="\u5ba1\u8ba1\u65e5\u5fd7\u5217\u8868"
    :columns="columns"
    :rows="auditLogs"
    :paginator="false"
    :show-create="false"
  />
</template>
`,
  'views/security/PermissionsView.vue': `<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { permissions } from '@/mock'

const columns = [
  { key: 'name', label: '\u6743\u9650\u540d\u79f0' },
  { key: 'code', label: '\u6807\u8bc6' },
  { key: 'type', label: '\u7c7b\u578b', width: 88 },
  { key: 'module', label: '\u6a21\u5757', width: 96 },
]
</script>

<template>
  <ListPageTemplate
    title="\u6743\u9650\u6e05\u5355"
    table-label="\u6743\u9650\u5217\u8868"
    :columns="columns"
    :rows="permissions"
    :paginator="false"
    :show-create="false"
  >
    <template #cell-type="{ value }">
      <WiTag
        :value="value === 'menu' ? '\u83dc\u5355' : value === 'button' ? '\u6309\u94ae' : '\u63a5\u53e3'"
        :severity="value === 'menu' ? 'info' : value === 'button' ? 'warn' : 'secondary'"
      />
    </template>
  </ListPageTemplate>
</template>
`,
  'views/security/DataScopeView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiLayoutContent,
  WiRadio,
  WiRadioGroup,
  WiSelect,
  WiSpace,
  useToast,
} from '@well-insight/ui'

const toast = useToast()
const scope = ref('department')
const department = ref('math')

function save() {
  toast.add({ severity: 'success', summary: '\u914d\u7f6e\u5df2\u4fdd\u5b58', life: 2500 })
}

function reset() {
  scope.value = 'department'
  department.value = 'math'
}
</script>

<template>
  <WiLayoutContent content-class="data-scope">
    <header class="data-scope__intro">
      <h1 class="data-scope__title">\u6570\u636e\u6743\u9650</h1>
      <p class="data-scope__desc">\u914d\u7f6e\u89d2\u8272\u53ef\u8bbf\u95ee\u7684\u6570\u636e\u8303\u56f4\uff0c\u652f\u6301\u6309\u9662\u7cfb\u9694\u79bb\u3002</p>
    </header>

    <WiCard title="\u6570\u636e\u8303\u56f4\u914d\u7f6e" class="data-scope__card">
      <WiForm label-position="top">
        <WiFormItem label="\u6570\u636e\u8303\u56f4" name="scope">
          <WiRadioGroup v-model="scope">
            <WiSpace vertical>
              <WiRadio value="self" label="\u4ec5\u672c\u4eba\u6570\u636e" />
              <WiRadio value="department" label="\u672c\u90e8\u95e8\u6570\u636e" />
              <WiRadio value="all" label="\u5168\u90e8\u6570\u636e" />
            </WiSpace>
          </WiRadioGroup>
        </WiFormItem>
        <WiFormItem v-if="scope === 'department'" label="\u6240\u5c5e\u9662\u7cfb" name="department">
          <WiSelect
            v-model="department"
            :options="[
              { label: '\u6570\u5b66\u7ec4', value: 'math' },
              { label: '\u8bed\u6587\u7ec4', value: 'chinese' },
              { label: '\u82f1\u8bed\u7ec4', value: 'english' },
            ]"
            fluid
          />
        </WiFormItem>
        <footer class="data-scope__actions">
          <WiSpace>
            <WiButton @click="save">\u4fdd\u5b58\u914d\u7f6e</WiButton>
            <WiButton severity="secondary" @click="reset">\u91cd\u7f6e</WiButton>
          </WiSpace>
        </footer>
      </WiForm>
    </WiCard>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.data-scope) {
  padding: var(--wi-space-6);
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.data-scope__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.data-scope__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.data-scope__card {
  box-shadow: var(--wi-shadow-sm);
}

.data-scope__actions {
  margin-top: var(--wi-space-4);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}
</style>
`,
  'views/analytics/ErrorMonitorView.vue': `<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { errorRecords } from '@/mock'

const columns = [
  { key: 'endpoint', label: '\u63a5\u53e3' },
  { key: 'code', label: '\u72b6\u6001\u7801', width: 88 },
  { key: 'message', label: '\u9519\u8bef\u4fe1\u606f' },
  { key: 'count', label: '\u6b21\u6570', width: 72 },
  { key: 'lastSeen', label: '\u6700\u8fd1\u51fa\u73b0', width: 140 },
]
</script>

<template>
  <ListPageTemplate
    title="\u5f02\u5e38\u76d1\u63a7"
    table-label="\u5f02\u5e38\u76d1\u63a7\u5217\u8868"
    :columns="columns"
    :rows="errorRecords"
    :paginator="false"
    :show-create="false"
  >
    <template #cell-code="{ value }">
      <WiTag :value="String(value)" :severity="Number(value) >= 500 ? 'danger' : 'warn'" />
    </template>
  </ListPageTemplate>
</template>
`,
  'views/analytics/ReportsView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiGrid, WiGridItem, WiLayoutContent, WiSelect, WiSpace } from '@well-insight/ui'
import { enrollmentTrend, gradeDistribution } from '@/mock'

const dimension = ref('grade')
const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))
</script>

<template>
  <WiLayoutContent content-class="reports-page">
    <header class="reports-page__header">
      <div>
        <h1 class="reports-page__title">\u6570\u636e\u62a5\u8868</h1>
        <p class="reports-page__desc">\u652f\u6301\u6309\u5e74\u7ea7\u3001\u9662\u7cfb\u6216\u6708\u4efd\u7ef4\u5ea6\u67e5\u770b\u7edf\u8ba1\uff08\u6f14\u793a\uff09\u3002</p>
      </div>
      <WiSpace>
        <WiSelect
          v-model="dimension"
          :options="[
            { label: '\u6309\u5e74\u7ea7', value: 'grade' },
            { label: '\u6309\u9662\u7cfb', value: 'department' },
            { label: '\u6309\u6708\u4efd', value: 'month' },
          ]"
          style="width: 10rem"
        />
        <WiButton severity="secondary">\u5bfc\u51fa Excel</WiButton>
        <WiButton severity="secondary">\u5bfc\u51fa PDF</WiButton>
      </WiSpace>
    </header>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="\u9009\u8bfe\u8d8b\u52bf" class="reports-page__card">
          <div class="reports-page__bars" role="img" aria-label="\u9009\u8bfe\u8d8b\u52bf\u67f1\u72b6\u56fe">
            <div v-for="item in enrollmentTrend" :key="item.month" class="reports-page__bar-item">
              <div class="reports-page__bar" :style="{ height: \`\${(item.count / maxTrend) * 100}%\` }" />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="\u5e74\u7ea7\u4eba\u6570\u5206\u5e03" class="reports-page__card">
          <ul class="reports-page__list">
            <li v-for="item in gradeDistribution" :key="item.grade">
              <span>{{ item.grade }}</span>
              <strong>{{ item.count }}</strong>
            </li>
          </ul>
        </WiCard>
      </WiGridItem>
    </WiGrid>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.reports-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.reports-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wi-space-4);
  flex-wrap: wrap;
}

.reports-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.reports-page__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.reports-page__card {
  box-shadow: var(--wi-shadow-sm);
}

.reports-page__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--wi-space-3);
  min-height: 10rem;
}

.reports-page__bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wi-space-2);
  height: 10rem;
  justify-content: flex-end;
  font-size: var(--wi-font-size-xs);
  color: var(--wi-color-text-muted);
}

.reports-page__bar {
  width: 100%;
  max-width: 2.5rem;
  border-radius: var(--wi-radius-sm) var(--wi-radius-sm) 0 0;
  background: color-mix(in srgb, var(--wi-color-primary) 70%, transparent);
}

.reports-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--wi-space-3);
}

.reports-page__list li {
  display: flex;
  justify-content: space-between;
  padding: var(--wi-space-3);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}
</style>
`,
  'views/system/DictionaryView.vue': `<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { dictionaries } from '@/mock'

const columns = [
  { key: 'type', label: '\u5b57\u5178\u7c7b\u578b', width: 140 },
  { key: 'label', label: '\u663e\u793a\u540d' },
  { key: 'value', label: '\u503c', width: 120 },
  { key: 'sort', label: '\u6392\u5e8f', width: 72 },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
]
</script>

<template>
  <ListPageTemplate
    title="\u5b57\u5178\u7ba1\u7406"
    table-label="\u5b57\u5178\u5217\u8868"
    :columns="columns"
    :rows="dictionaries"
    :paginator="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'enabled' ? '\u542f\u7528' : '\u505c\u7528'" :severity="value === 'enabled' ? 'success' : 'secondary'" />
    </template>
  </ListPageTemplate>
</template>
`,
  'views/system/SchedulerView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiSpace, WiTag, useToast } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { schedulerJobs } from '@/mock'

const toast = useToast()
const rows = ref(schedulerJobs)

const columns = [
  { key: 'name', label: '\u4efb\u52a1\u540d\u79f0' },
  { key: 'cron', label: 'Cron', width: 120 },
  { key: 'lastRun', label: '\u4e0a\u6b21\u6267\u884c', width: 140 },
  { key: 'nextRun', label: '\u4e0b\u6b21\u6267\u884c', width: 140 },
  { key: 'status', label: '\u72b6\u6001', width: 96 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 160 },
]

function runNow(id: string) {
  toast.add({ severity: 'success', summary: '\u4efb\u52a1\u5df2\u89e6\u53d1', detail: id, life: 2500 })
}

function togglePause(row: { id: string; status: string }) {
  row.status = row.status === 'paused' ? 'idle' : 'paused'
}
</script>

<template>
  <ListPageTemplate
    title="\u5b9a\u65f6\u4efb\u52a1"
    table-label="\u5b9a\u65f6\u4efb\u52a1\u5217\u8868"
    :columns="columns"
    :rows="rows"
    :paginator="false"
  >
    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'running' ? '\u8fd0\u884c\u4e2d' : value === 'paused' ? '\u5df2\u6682\u505c' : '\u7a7a\u95f2'"
        :severity="value === 'running' ? 'success' : value === 'paused' ? 'warn' : 'info'"
      />
    </template>
    <template #cell-actions="{ row }">
      <WiSpace>
        <WiButton size="small" severity="secondary" @click="runNow(row.id)">\u7acb\u5373\u6267\u884c</WiButton>
        <WiButton size="small" severity="secondary" @click="togglePause(row)">
          {{ row.status === 'paused' ? '\u6062\u590d' : '\u6682\u505c' }}
        </WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/system/MessageCenterView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiLayoutContent, WiTable, WiTabs, WiTag } from '@well-insight/ui'
import { messages } from '@/mock'

const columns = [
  { key: 'channel', label: '\u6e20\u9053', width: 88 },
  { key: 'title', label: '\u6807\u9898' },
  { key: 'template', label: '\u6a21\u677f', width: 140 },
  { key: 'sentAt', label: '\u53d1\u9001\u65f6\u95f4', width: 140 },
  { key: 'status', label: '\u72b6\u6001', width: 88 },
]

const tab = ref('records')
</script>

<template>
  <WiLayoutContent content-class="messages-page">
    <h1 class="messages-page__title">\u6d88\u606f\u4e2d\u5fc3</h1>
    <WiTabs
      v-model="tab"
      :tabs="[
        { label: '\u53d1\u9001\u8bb0\u5f55', value: 'records' },
        { label: '\u6d88\u606f\u6a21\u677f', value: 'templates' },
      ]"
    />
    <WiCard v-if="tab === 'records'">
      <WiTable :columns="columns" :rows="messages as unknown as Record<string, unknown>[]" striped bordered paginator>
        <template #cell-status="{ value }">
          <WiTag
            :value="value === 'success' ? '\u6210\u529f' : value === 'failed' ? '\u5931\u8d25' : '\u6392\u961f\u4e2d'"
            :severity="value === 'success' ? 'success' : value === 'failed' ? 'danger' : 'warn'"
          />
        </template>
      </WiTable>
    </WiCard>
    <WiCard v-else title="\u6a21\u677f\u7ba1\u7406">
      <p class="messages-page__desc">\u7ef4\u62a4\u7ad9\u5185\u4fe1\u3001\u77ed\u4fe1\u4e0e\u90ae\u4ef6\u6a21\u677f\u3002</p>
      <WiButton>\u65b0\u5efa\u6a21\u677f</WiButton>
    </WiCard>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.messages-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.messages-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.messages-page__desc {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
}
</style>
`,
  'views/system/SystemConfigView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput, WiLayoutContent, WiTable, useToast } from '@well-insight/ui'
import { systemParams, type SystemParam } from '@/mock'

type SystemParamRow = SystemParam & Record<string, unknown>

const toast = useToast()
const rows = ref<SystemParamRow[]>(systemParams.map((item) => ({ ...item })))

const columns = [
  { key: 'group', label: '\u5206\u7ec4', width: 96 },
  { key: 'key', label: '\u53c2\u6570\u952e' },
  { key: 'value', label: '\u53c2\u6570\u503c', width: 160 },
  { key: 'description', label: '\u8bf4\u660e' },
  { key: 'actions', label: '\u64cd\u4f5c', width: 96 },
]

function save(row: SystemParamRow) {
  toast.add({ severity: 'success', summary: '\u53c2\u6570\u5df2\u66f4\u65b0', detail: row.key, life: 2500 })
}
</script>

<template>
  <WiLayoutContent content-class="config-page">
    <header class="config-page__intro">
      <h1 class="config-page__title">\u7cfb\u7edf\u914d\u7f6e</h1>
      <p class="config-page__desc">\u52a8\u6001\u53c2\u6570\u4fee\u6539\u540e\u5373\u65f6\u751f\u6548\uff0c\u65e0\u9700\u91cd\u542f\u670d\u52a1\uff08\u7eaf\u524d\u7aef\u6f14\u793a\uff09\u3002</p>
    </header>

    <WiTable
      :columns="columns"
      :rows="rows"
      striped
      bordered
      :paginator="false"
      aria-label="\u7cfb\u7edf\u53c2\u6570\u5217\u8868"
    >
      <template #cell-value="{ row }">
        <WiInput v-model="(row as SystemParamRow).value" size="small" />
      </template>
      <template #cell-actions="{ row }">
        <WiButton size="small" @click="save(row as SystemParamRow)">\u4fdd\u5b58</WiButton>
      </template>
    </WiTable>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.config-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.config-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.config-page__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
`,
  'views/extras/RecycleBinView.vue': `<script setup lang="ts">
import { WiButton, WiSpace, useToast } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { recycleBin } from '@/mock'

const toast = useToast()

const columns = [
  { key: 'name', label: '\u540d\u79f0' },
  { key: 'module', label: '\u6a21\u5757', width: 112 },
  { key: 'deletedBy', label: '\u5220\u9664\u4eba', width: 96 },
  { key: 'deletedAt', label: '\u5220\u9664\u65f6\u95f4', width: 112 },
  { key: 'expireAt', label: '\u8fc7\u671f\u65f6\u95f4', width: 112 },
  { key: 'actions', label: '\u64cd\u4f5c', width: 120 },
]

function restore(name: string) {
  toast.add({ severity: 'success', summary: '\u5df2\u6062\u590d', detail: name, life: 2500 })
}
</script>

<template>
  <ListPageTemplate
    title="\u56de\u6536\u7ad9"
    table-label="\u56de\u6536\u7ad9\u5217\u8868"
    :columns="columns"
    :rows="recycleBin"
    :paginator="false"
  >
    <template #cell-actions="{ row }">
      <WiSpace>
        <WiButton size="small" @click="restore(row.name)">\u6062\u590d</WiButton>
        <WiButton size="small" severity="danger">\u5f7b\u5e95\u5220\u9664</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
`,
  'views/auth/LoginView.vue': `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiInput,
  WiInputOtp,
  WiMessage,
  WiSpace,
  WiTabs,
  useToast,
} from '@well-insight/ui'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, verifyMfa, mfaVerified, user } = useAuth()
const toast = useToast()

const tab = ref('password')
const account = ref('admin')
const password = ref('admin123')
const email = ref('')
const otp = ref('')
const loading = ref(false)
const error = ref('')

const showMfa = computed(() => route.query.mfa === '1' || (user.value && !mfaVerified.value))

async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  if (tab.value === 'otp') {
    error.value = '\u90ae\u7bb1\u9a8c\u8bc1\u7801\u767b\u5f55\u6682\u672a\u5f00\u653e\uff0c\u8bf7\u4f7f\u7528\u8d26\u53f7\u5bc6\u7801'
    return
  }
  await onLogin()
}

async function onLogin() {
  loading.value = true
  error.value = ''
  try {
    await login({ account: account.value, password: password.value })
    toast.add({ severity: 'success', summary: '\u767b\u5f55\u6210\u529f', detail: '\u6b22\u8fce\u56de\u6765', life: 3000 })
    router.push('/dashboard')
  } catch (err) {
    const message = err instanceof Error ? err.message : '\u767b\u5f55\u5931\u8d25'
    if (message === 'MFA_REQUIRED') {
      router.replace('/login?mfa=1')
      error.value = '\u9700\u8981 MFA \u9a8c\u8bc1\uff0c\u6f14\u793a\u9a8c\u8bc1\u7801 123456'
    } else {
      error.value = message
    }
  } finally {
    loading.value = false
  }
}

async function onVerifyMfaSubmit(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onVerifyMfa()
}

async function onVerifyMfa() {
  loading.value = true
  error.value = ''
  try {
    await verifyMfa(otp.value)
    toast.add({ severity: 'success', summary: '\u9a8c\u8bc1\u6210\u529f', life: 2500 })
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '\u9a8c\u8bc1\u5931\u8d25'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WiCard class="login-page">
    <header class="login-page__header">
      <h1>\u667a\u5b66\u4e91 \u00b7 \u6559\u80b2\u7ba1\u7406\u540e\u53f0</h1>
      <p>\u6f14\u793a\u8d26\u53f7 admin / admin123 \u00b7 MFA 123456</p>
    </header>

    <WiMessage v-if="error" severity="error" :closable="false">{{ error }}</WiMessage>

    <template v-if="showMfa">
      <WiForm @submit="onVerifyMfaSubmit">
        <WiFormItem label="MFA \u9a8c\u8bc1\u7801" name="otp" required>
          <WiInputOtp v-model="otp" :length="6" />
        </WiFormItem>
        <WiButton native-type="submit" fluid :loading="loading">\u5b8c\u6210\u9a8c\u8bc1</WiButton>
      </WiForm>
    </template>

    <template v-else>
      <WiTabs
        v-model="tab"
        :tabs="[
          { label: '\u8d26\u53f7\u5bc6\u7801', value: 'password' },
          { label: '\u90ae\u7bb1\u9a8c\u8bc1\u7801', value: 'otp' },
        ]"
      />
      <WiForm @submit="onSubmitForm">
        <WiFormItem v-if="tab === 'password'" label="\u8d26\u53f7" name="account" required>
          <WiInput v-model="account" placeholder="admin / teacher" fluid />
        </WiFormItem>
        <WiFormItem v-if="tab === 'password'" label="\u5bc6\u7801" name="password" required>
          <WiInput v-model="password" type="password" fluid />
        </WiFormItem>
        <WiFormItem v-else label="\u90ae\u7bb1\u9a8c\u8bc1\u7801" name="emailOtp">
          <WiSpace>
            <WiInput v-model="email" placeholder="name@educloud.cn" fluid />
            <WiButton severity="secondary" type="button">\u83b7\u53d6\u9a8c\u8bc1\u7801</WiButton>
          </WiSpace>
        </WiFormItem>
        <WiButton native-type="submit" fluid :loading="loading">\u767b\u5f55</WiButton>
      </WiForm>
      <p class="login-page__footer">
        \u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f
        <RouterLink to="/register">\u6ce8\u518c</RouterLink>
      </p>
    </template>
  </WiCard>
</template>

<style scoped>
.login-page {
  width: min(100%, 26rem);
  padding: var(--wi-space-6);
  box-shadow: var(--wi-shadow-md);
}

.login-page__header h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
}

.login-page__header p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.login-page__footer {
  margin: var(--wi-space-4) 0 0;
  text-align: center;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.login-page__footer a {
  color: var(--wi-color-primary);
}
</style>
`,
  'views/auth/RegisterView.vue': `<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiInput,
  useToast,
} from '@well-insight/ui'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const toast = useToast()
const loading = ref(false)

const model = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
})

async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onSubmit()
}

async function onSubmit() {
  if (model.password !== model.confirm) {
    toast.add({ severity: 'warn', summary: '\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4', life: 3000 })
    return
  }
  loading.value = true
  try {
    await register({ name: model.name, email: model.email, password: model.password })
    toast.add({ severity: 'success', summary: '\u6ce8\u518c\u6210\u529f', life: 2500 })
    router.push('/dashboard')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '\u6ce8\u518c\u5931\u8d25',
      detail: err instanceof Error ? err.message : undefined,
      life: 3500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WiCard class="register-page">
    <header class="register-page__header">
      <h1>\u6ce8\u518c\u667a\u5b66\u4e91\u8d26\u53f7</h1>
      <p>\u6f14\u793a\u6ce8\u518c\uff0c\u6570\u636e\u4fdd\u5b58\u5728 localStorage</p>
    </header>
    <WiForm @submit="onSubmitForm">
      <WiFormItem label="\u59d3\u540d" name="name" required>
        <WiInput v-model="model.name" fluid />
      </WiFormItem>
      <WiFormItem label="\u90ae\u7bb1" name="email" required>
        <WiInput v-model="model.email" type="email" fluid />
      </WiFormItem>
      <WiFormItem label="\u5bc6\u7801" name="password" required>
        <WiInput v-model="model.password" type="password" fluid />
      </WiFormItem>
      <WiFormItem label="\u786e\u8ba4\u5bc6\u7801" name="confirm" required>
        <WiInput v-model="model.confirm" type="password" fluid />
      </WiFormItem>
      <WiButton native-type="submit" fluid :loading="loading">\u63d0\u4ea4\u6ce8\u518c</WiButton>
    </WiForm>
    <p class="register-page__footer">
      \u5df2\u6709\u8d26\u53f7\uff1f
      <RouterLink to="/login">\u53bb\u767b\u5f55</RouterLink>
    </p>
  </WiCard>
</template>

<style scoped>
.register-page {
  width: min(100%, 26rem);
  padding: var(--wi-space-6);
  box-shadow: var(--wi-shadow-md);
}

.register-page__header h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
}

.register-page__header p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.register-page__footer {
  margin-top: var(--wi-space-4);
  text-align: center;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.register-page__footer a {
  color: var(--wi-color-primary);
}
</style>
`,
  'views/NotFoundView.vue': `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WiButton, WiLayoutContent } from '@well-insight/ui'

const router = useRouter()
</script>

<template>
  <WiLayoutContent content-class="not-found">
    <h1>404</h1>
    <p>\u9875\u9762\u4e0d\u5b58\u5728\u6216\u5df2\u88ab\u79fb\u9664\u3002</p>
    <WiButton @click="router.push('/dashboard')">\u8fd4\u56de\u9996\u9875</WiButton>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.not-found) {
  padding: var(--wi-space-12);
  text-align: center;
}

.not-found h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: 3rem;
  color: var(--wi-color-text-muted);
}

.not-found p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
}
</style>
`,
}

for (const [rel, content] of Object.entries(files)) {
  const target = join(root, rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content, 'utf8')
  console.log('wrote', rel)
}

console.log('restore-views: wrote', Object.keys(files).length, 'files')
