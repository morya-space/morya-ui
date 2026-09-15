<script setup lang="ts">
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: '姓名', sortable: true, minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
  { key: 'email', label: '邮箱', minWidth: 180 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', email: 'ada@well.design' },
  { id: 2, name: 'Lin', role: 'Engineer', email: 'lin@well.design' },
  { id: 3, name: 'Kai', role: 'Engineer', email: 'kai@well.design' },
  { id: 4, name: 'Mia', role: 'Designer', email: 'mia@well.design' },
  { id: 5, name: 'Neo', role: 'Engineer', email: 'neo@well.design' },
]
const page = ref(1)
</script>

<template>
  <MTable
    v-model:page="page"
    :columns="columns"
    :rows="rows"
    paginator
    :rows-per-page="3"
  />
</template>
