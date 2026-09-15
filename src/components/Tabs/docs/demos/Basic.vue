<script setup lang="ts">
import { MTabs } from 'morya-ui'
import { ref } from 'vue'

const active = ref('design')
const tabs = [
  { label: 'Design', value: 'design' },
  { label: 'Code', value: 'code' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <MTabs v-model="active" :tabs="tabs">
    <template #default="{ activeValue }">
      <p style="margin:0">
        Active panel: {{ activeValue }}
      </p>
    </template>
  </MTabs>
</template>
