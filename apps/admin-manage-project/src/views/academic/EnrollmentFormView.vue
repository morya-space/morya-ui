<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  WiButton,
  WiDatePicker,
  WiFileUpload,
  WiForm,
  WiFormItem,
  WiInput,
  WiSelect,
  WiSpace,
  WiSwitch,
  WiTextarea,
} from '@well-insight/ui'
import FormPageTemplate from '@/components/FormPageTemplate.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useLocale } from '@/composables/useLocale'
import { courses } from '@/mock'

const feedback = useActionFeedback()
const { t } = useLocale()
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
  feedback.info(t('草稿已保存', 'Draft saved'))
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
  feedback.notify(
    t('选课申请已提交', 'Enrollment submitted'),
    t('请等待教务审核', 'Pending academic review'),
  )
}
</script>

<template>
  <FormPageTemplate
    :title="t('选课报名表', 'Enrollment Form')"
    :description="t('填写学生与课程信息，支持上传实验类课程所需材料。', 'Enter student and course details. Upload materials for lab courses when required.')"
  >
    <WiForm @submit="onSubmitForm">
      <WiFormItem :label="t('学生姓名', 'Student name')" name="studentName" required>
        <WiInput v-model="model.studentName" fluid />
      </WiFormItem>
      <WiFormItem :label="t('学号', 'Student ID')" name="studentNo" required>
        <WiInput v-model="model.studentNo" fluid />
      </WiFormItem>
      <WiFormItem :label="t('申请课程', 'Course')" name="courseId" required>
        <WiSelect
          v-model="model.courseId"
          :options="courseOptions"
          :placeholder="t('请选择课程', 'Select a course')"
          fluid
          @update:model-value="onCourseChange"
        />
      </WiFormItem>

      <WiFormItem v-if="model.needMaterial" :label="t('上传材料', 'Materials')" name="material">
        <WiFileUpload mode="basic" accept=".pdf,.jpg,.png" />
        <WiTextarea
          v-model="model.materialNote"
          :rows="2"
          :placeholder="t('材料说明（可选）', 'Notes (optional)')"
          fluid
        />
      </WiFormItem>

      <WiFormItem :label="t('申请日期', 'Apply date')" name="applyDate">
        <WiDatePicker v-model="model.applyDate" fluid />
      </WiFormItem>

      <WiFormItem :label="t('申请理由', 'Reason')" name="reason">
        <WiTextarea v-model="model.reason" :rows="4" fluid />
      </WiFormItem>

      <WiFormItem :label="t('通知家长', 'Notify guardian')" name="notify">
        <WiSwitch :model-value="true" />
      </WiFormItem>

      <footer class="enrollment-form__actions">
        <WiSpace vertical align="start">
          <WiSpace>
            <WiButton native-type="submit" :loading="submitting">{{ t('提交申请', 'Submit') }}</WiButton>
            <WiButton severity="secondary" type="button" @click="saveDraft">{{ t('保存草稿', 'Save draft') }}</WiButton>
            <WiButton severity="secondary" type="button">{{ t('取消', 'Cancel') }}</WiButton>
          </WiSpace>
          <p v-if="draftSaved" class="enrollment-form__draft-hint">
            {{ t('草稿已保存至 localStorage', 'Draft saved to localStorage') }}
          </p>
        </WiSpace>
      </footer>
    </WiForm>
  </FormPageTemplate>
</template>

<style scoped>
.enrollment-form__actions {
  margin-top: var(--wi-space-4);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}

.enrollment-form__draft-hint {
  margin: 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
