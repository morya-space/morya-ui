<script setup lang="ts">
import { MStepper } from 'morya-ui'
import { ref } from 'vue'

const active = ref(1)
const steps = [
  { label: 'Basic info', description: 'Fill in details', status: 'finish' },
  { label: 'Confirm', description: 'Review', status: 'process' },
  { label: 'Done', description: 'Submit' },
]
</script>

<template>
  <MStepper v-model="active" vertical :steps="steps" />
</template>
