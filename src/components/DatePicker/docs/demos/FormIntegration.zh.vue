<script setup lang="ts">
import { MButton, MDatePicker } from 'morya-ui'
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  startDate: null as string | null,
  endDate: null as string | null,
})

const submitted = ref<string | null>(null)

function iso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
const today = iso(new Date())

const startError = ref('')
const endError = ref('')

function submit() {
  startError.value = form.startDate ? '' : '请选择开始日期'
  endError.value = form.endDate ? '' : '请选择结束日期'
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    endError.value = '结束日期不能早于开始日期'
  }
  if (startError.value || endError.value) return
  submitted.value = JSON.stringify(form, null, 2)
}
</script>

<template>
  <form style="display: grid; gap: 12px; max-width: 32rem" @submit.prevent="submit">
    <MDatePicker
      v-model="form.startDate"
      label="开始日期"
      required
      :min-date="today"
      :error-message="startError"
    />
    <MDatePicker
      v-model="form.endDate"
      label="结束日期"
      required
      :min-date="form.startDate ?? today"
      :error-message="endError"
    />
    <div>
      <MButton type="primary" html-type="submit">提交</MButton>
    </div>
    <pre v-if="submitted" style="background: var(--m-color-surface-sunken); padding: 8px; border-radius: 4px; font-size: 12px">{{ submitted }}</pre>
  </form>
</template>
