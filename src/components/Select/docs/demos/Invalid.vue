<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <MSelect
    v-model="value"
    :options="options"
    placeholder="Required"
    invalid
    help-text="Please select a team"
  />
</template>
