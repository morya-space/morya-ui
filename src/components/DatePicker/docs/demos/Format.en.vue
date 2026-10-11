<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const isoDate = ref<string | null>('2024-06-15')
const slashDate = ref<string | null>('2024-06-15')
const usDate = ref<string | null>('2024-06-15')
const time = ref<string | null>('2024-06-15 14:30')
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker v-model="isoDate" label="Default ISO (YYYY-MM-DD)" />
    <MDatePicker v-model="slashDate" label="Slash (YYYY/MM/DD)" format="YYYY/MM/DD" />
    <MDatePicker v-model="usDate" label="US style (MM/DD/YYYY)" format="MM/DD/YYYY" />
    <MDatePicker
      v-model="time"
      type="datetime"
      label="Datetime with slash (YYYY/MM/DD HH:mm)"
      format="YYYY/MM/DD"
    />
  </div>
</template>
