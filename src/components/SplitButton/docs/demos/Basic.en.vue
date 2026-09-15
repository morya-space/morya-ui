<script setup lang="ts">
import { MSplitButton } from 'morya-ui'

const items = [
  { label: 'Save as', command: () => console.log('save as') },
  { label: 'Export', command: () => console.log('export') },
]
</script>

<template>
  <MSplitButton label="Save" :model="items" @click="() => console.log('save')" />
</template>
