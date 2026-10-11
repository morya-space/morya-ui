<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const datetime = ref<string | null>('2024-06-15 14:30')
const datetimeSec = ref<string | null>('2024-06-15 14:30:45')
const range = ref<[string, string] | null>(null)
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker
      v-model="datetime"
      type="datetime"
      label="Datetime (minute)"
      help-text="Pick a date, then time; pair with need-confirm for a smoother flow"
    />
    <MDatePicker
      v-model="datetimeSec"
      type="datetime"
      label="Datetime (with seconds)"
      show-seconds
      need-confirm
    />
    <MDatePicker
      v-model="range"
      type="datetimerange"
      label="Datetime range"
      need-confirm
      help-text="Pick two dates, then adjust start / end time in the time columns"
    />
  </div>
</template>
