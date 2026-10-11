<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const warning = ref<string | null>('2024-06-15')
const error = ref<string | null>('2024-06-20')
</script>

<template>
  <div style="display: grid; gap: 12px">
    <MDatePicker v-model="warning" label="Warning status" status="warning" help-text="A friendly reminder" />
    <MDatePicker v-model="error" label="Error status" status="error" help-text="Something is wrong" />
  </div>
</template>
