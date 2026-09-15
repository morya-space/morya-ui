<script setup lang="ts">
import { MStepper } from 'morya-ui'
import { ref } from 'vue'

const active = ref(0)
const steps = [
  { label: 'Basic info' },
  { label: 'Confirm' },
  { label: 'Done' },
]
</script>

<template>
  <MStepper v-model="active" :steps="steps" />
</template>
