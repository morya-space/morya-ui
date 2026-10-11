<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const dates = ref<string[]>(['2024-06-10', '2024-06-15'])
</script>

<template>
  <MDatePicker v-model="dates" label="多选日期" multiple />
</template>
