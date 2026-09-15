<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref<[string, string] | null>(['2024-06-01', '2024-06-12'])
</script>

<template>
  <MDatePicker v-model="value" type="daterange" label="Date range" />
</template>
