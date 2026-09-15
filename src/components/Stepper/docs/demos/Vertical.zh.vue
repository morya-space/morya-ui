<script setup lang="ts">
import type { StepperStep } from 'morya-ui'
import { MStepper } from 'morya-ui'
import { ref } from 'vue'

const active = ref(1)
const steps: StepperStep[] = [
  { label: '基本信息', description: '填写资料', status: 'finish' },
  { label: '确认', description: '核对内容', status: 'process' },
  { label: '完成', description: '提交' },
]
</script>

<template>
  <MStepper v-model="active" vertical :steps="steps" />
</template>
