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
      label="日期时间（分钟）"
      help-text="点击日期后再选时间，配合 need-confirm 体验更佳"
    />
    <MDatePicker
      v-model="datetimeSec"
      type="datetime"
      label="日期时间（含秒）"
      show-seconds
      need-confirm
    />
    <MDatePicker
      v-model="range"
      type="datetimerange"
      label="日期时间范围"
      need-confirm
      help-text="两次点击选定日期，再用时间列调整起止时刻"
    />
  </div>
</template>
