<script setup lang="ts">
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
]
const selection = ref<Record<string, unknown>[]>([])
</script>

<template>
  <MTable
    v-model:selection="selection"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    highlight-current
    :paginator="false"
  />
</template>
