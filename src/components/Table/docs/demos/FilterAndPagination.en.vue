<script setup lang="ts">
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true, minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
  { id: 3, name: 'Kai', role: 'Engineer' },
  { id: 4, name: 'Mia', role: 'Designer' },
]
const page = ref(1)
</script>

<template>
  <MTable
    v-model:page="page"
    :columns="columns"
    :rows="rows"
    paginator
    :rows-per-page="2"
  />
</template>
