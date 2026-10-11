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
  startError.value = form.startDate ? '' : 'Start date is required'
  endError.value = form.endDate ? '' : 'End date is required'
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    endError.value = 'End date cannot be earlier than start date'
  }
  if (startError.value || endError.value) return
  submitted.value = JSON.stringify(form, null, 2)
}
</script>

<template>
  <form style="display: grid; gap: 12px; max-width: 32rem" @submit.prevent="submit">
    <MDatePicker
      v-model="form.startDate"
      label="Start date"
      required
      :min-date="today"
      :error-message="startError"
    />
    <MDatePicker
      v-model="form.endDate"
      label="End date"
      required
      :min-date="form.startDate ?? today"
      :error-message="endError"
    />
    <div>
      <MButton type="primary" html-type="submit">Submit</MButton>
    </div>
    <pre v-if="submitted" style="background: var(--m-color-surface-sunken); padding: 8px; border-radius: 4px; font-size: 12px">{{ submitted }}</pre>
  </form>
</template>
