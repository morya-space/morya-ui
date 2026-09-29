<script setup lang="ts">
import { MTimePicker } from 'morya-ui'
import { ref } from 'vue'

const time = ref('14:30')
const withSeconds = ref('14:30:00')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem;">
    <MTimePicker v-model="time" label="时间" />
    <MTimePicker v-model="withSeconds" label="含秒" show-seconds />
  </div>
</template>
