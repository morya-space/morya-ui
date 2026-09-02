<script setup lang="ts">
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

const courseOptions = courses.map((item) => ({ label: `${item.name} · ${item.teacher}`, value: item.id }))

const selectedCourse = computed(() => courses.find((item) => item.id === model.courseId))

function onCourseChange() {
  model.needMaterial = selectedCourse.value?.category === '实验'
}

function saveDraft() {
  localStorage.setItem('edu-enrollment-draft', JSON.stringify(model))
  draftSaved.value = true
  toast.add({ severity: 'info', summary: '草稿已保存', life: 2500 })
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
  toast.add({ severity: 'success', summary: '选课申请已提交', detail: '请等待教务审核', life: 3000 })
}
</script>

<template>
  <WiLayoutContent content-class="enrollment-form">
    <header class="enrollment-form__intro">
      <h1>选课报名表</h1>
      <p>填写学生与课程信息，支持上传实验类课程所需材料。</p>
    </header>

    <WiCard class="enrollment-form__card">
      <WiForm @submit="onSubmitForm">
        <WiFormItem label="学生姓名" name="studentName" required>
          <WiInput v-model="model.studentName" fluid />
        </WiFormItem>
        <WiFormItem label="学号" name="studentNo" required>
          <WiInput v-model="model.studentNo" fluid />
        </WiFormItem>
        <WiFormItem label="申请课程" name="courseId" required>
          <WiSelect
            v-model="model.courseId"
            :options="courseOptions"
            placeholder="请选择课程"
            fluid
            @update:model-value="onCourseChange"
          />
        </WiFormItem>

        <WiFormItem v-if="model.needMaterial" label="上传材料" name="material">
          <WiFileUpload mode="basic" accept=".pdf,.jpg,.png" />
          <WiTextarea v-model="model.materialNote" :rows="2" placeholder="材料说明（可选）" fluid />
        </WiFormItem>

        <WiFormItem label="申请日期" name="applyDate">
          <WiDatePicker v-model="model.applyDate" fluid />
        </WiFormItem>

        <WiFormItem label="申请理由" name="reason">
          <WiTextarea v-model="model.reason" :rows="4" fluid />
        </WiFormItem>

        <WiFormItem label="通知家长" name="notify">
          <WiSwitch :model-value="true" />
        </WiFormItem>

        <footer class="enrollment-form__actions">
          <WiSpace>
            <WiButton native-type="submit" :loading="submitting">提交申请</WiButton>
            <WiButton severity="secondary" @click="saveDraft">保存草稿</WiButton>
            <WiButton severity="secondary">取消</WiButton>
          </WiSpace>
          <p v-if="draftSaved" class="enrollment-form__draft-hint">草稿已保存至 localStorage</p>
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
