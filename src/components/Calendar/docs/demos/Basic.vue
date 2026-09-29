<script setup lang="ts">
import { ref } from 'vue'
import { MCalendar } from 'morya-ui'

const value = ref<string | null>('2024-06-15')

function onPanelChange(date: Date, mode: string) {
  console.log('panel', date, mode)
}
</script>

<template>
  <MCalendar
    v-model="value"
    show-week
    @panel-change="onPanelChange"
  />
</template>
