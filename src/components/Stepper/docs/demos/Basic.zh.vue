<script setup lang="ts">
import { MStepper } from 'morya-ui'
import { ref } from 'vue'

const active = ref(0)
const steps = [
  { label: '基本信息' },
  { label: '确认' },
  { label: '完成' },
]
</script>

<template>
  <MStepper v-model="active" :steps="steps" />
</template>
