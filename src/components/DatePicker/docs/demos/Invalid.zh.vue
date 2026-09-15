<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref('2024-06-15')
</script>

<template>
  <MDatePicker v-model="value" label="校验失败" invalid />
</template>
