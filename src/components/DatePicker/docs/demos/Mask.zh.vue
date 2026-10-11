<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const date = ref<string | null>('2024-06-15')
const datetime = ref<string | null>('2024-06-15 14:30')
</script>

<template>
  <div style="display: grid; gap: 12px">
    <MDatePicker v-model="date" label="输入掩码（date）" mask />
    <MDatePicker v-model="datetime" type="datetime" label="输入掩码（datetime）" mask />
  </div>
</template>
