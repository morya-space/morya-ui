<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const datetime = ref<string | null>('2024-06-15 14:30')
const time = ref<string | null>('09:15')
</script>

<template>
  <div style="display: grid; gap: 12px">
    <MDatePicker v-model="datetime" type="datetime" label="日期时间（需确认）" need-confirm />
    <MDatePicker v-model="time" type="time" label="时间（需确认）" need-confirm />
  </div>
</template>
