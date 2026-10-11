<script setup lang="ts">
import { MDatePicker, MTag } from 'morya-ui'
import { computed, ref } from 'vue'

const selectedDates = ref<string[]>([])

const sorted = computed(() =>
  [...selectedDates.value].sort((a, b) => (a < b ? -1 : 1)),
)

const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
function formatDay(iso: string) {
  const d = new Date(iso)
  return `${iso.slice(5)} ${weekdayMap[d.getDay()]}`
}
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker
      v-model="selectedDates"
      label="Pick shift days"
      multiple
      help-text="Click to toggle; you can pick across months"
    />
    <div v-if="sorted.length" style="display: flex; flex-wrap: wrap; gap: 6px">
      <MTag v-for="iso in sorted" :key="iso" :value="formatDay(iso)" type="primary" />
    </div>
    <p v-else style="color: var(--m-color-text-muted); font-size: 13px; margin: 0">
      No days selected yet
    </p>
  </div>
</template>
