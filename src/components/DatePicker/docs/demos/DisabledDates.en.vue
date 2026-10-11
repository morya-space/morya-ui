<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { computed, ref } from 'vue'

const pastOnly = ref<string | null>(null)
const futureOnly = ref<string | null>(null)
const next30 = ref<string | null>(null)

function iso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const today = computed(() => iso(new Date()))
const in30Days = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return iso(d)
})
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker
      v-model="pastOnly"
      label="Past dates only"
      :max-date="today"
      help-text="max-date = today"
    />
    <MDatePicker
      v-model="futureOnly"
      label="Future dates only"
      :min-date="today"
      help-text="min-date = today"
    />
    <MDatePicker
      v-model="next30"
      label="Within next 30 days"
      :min-date="today"
      :max-date="in30Days"
      help-text="min-date + max-date combined"
    />
  </div>
</template>
