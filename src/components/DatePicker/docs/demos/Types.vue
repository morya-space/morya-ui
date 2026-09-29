<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const month = ref('2024-06')
const year = ref('2024')
const time = ref('14:30')
const datetime = ref('2024-06-15 09:00')
const datetimerange = ref<[string, string] | null>(null)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem;">
    <MDatePicker v-model="month" type="month" label="月份" />
    <MDatePicker v-model="year" type="year" label="年份" />
    <MDatePicker v-model="time" type="time" label="时间" />
    <MDatePicker v-model="datetime" type="datetime" label="日期时间" />
    <MDatePicker
      v-model="datetimerange"
      type="datetimerange"
      label="日期时间范围"
      help-text="两次点击选定日期后以 00:00 发出；时间列可再改终点时刻。"
    />
  </div>
</template>
