<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const isoDate = ref<string | null>('2024-06-15')
const slashDate = ref<string | null>('2024-06-15')
const chineseDate = ref<string | null>('2024-06-15')
const time12 = ref<string | null>('2024-06-15 14:30')
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker v-model="isoDate" label="默认 ISO（YYYY-MM-DD）" />
    <MDatePicker v-model="slashDate" label="斜杠格式（YYYY/MM/DD）" format="YYYY/MM/DD" />
    <MDatePicker v-model="chineseDate" label="中文格式（YYYY年MM月DD日）" format="YYYY年MM月DD日" />
    <MDatePicker
      v-model="time12"
      type="datetime"
      label="日期时间带斜杠（YYYY/MM/DD HH:mm）"
      format="YYYY/MM/DD"
    />
  </div>
</template>
