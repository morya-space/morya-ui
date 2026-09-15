<script setup lang="ts">
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: '项目', sortable: true, minWidth: 140 },
  { key: 'owner', label: '负责人', minWidth: 100 },
]
const rows = ref([
  { id: 1, name: 'Landing', owner: 'Ada' },
  { id: 2, name: 'Dashboard', owner: 'Lin' },
])
const serverOptions = ref({ page: 1, rowsPerPage: 10, sortBy: 'name', sortType: 'asc' as const })
const total = ref(42)
</script>

<template>
  <MTable
    v-model:server-options="serverOptions"
    :columns="columns"
    :rows="rows"
    :server-items-length="total"
    :loading="false"
  />
</template>
