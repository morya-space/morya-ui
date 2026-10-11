<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { computed, ref } from 'vue'

const weekdayOnly = ref<string | null>(null)
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
      v-model="weekdayOnly"
      label="只能选今天之前"
      :max-date="today"
      help-text="max-date = 今天"
    />
    <MDatePicker
      v-model="futureOnly"
      label="只能选未来日期"
      :min-date="today"
      help-text="min-date = 今天"
    />
    <MDatePicker
      v-model="next30"
      label="只能选未来 30 天内"
      :min-date="today"
      :max-date="in30Days"
      help-text="min-date 与 max-date 组合"
    />
  </div>
</template>
