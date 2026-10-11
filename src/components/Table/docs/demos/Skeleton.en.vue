<script setup lang="ts">
import { MButton, MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Project', minWidth: 160 },
  { key: 'owner', label: 'Owner', minWidth: 100 },
  { key: 'team', label: 'Team', minWidth: 120 },
  { key: 'progress', label: 'Progress', width: 100, align: 'end' as const },
]

const allRows = [
  { id: 1, name: 'Landing Redesign', owner: 'Ada', team: 'Design', progress: '100%' },
  { id: 2, name: 'Dashboard v2', owner: 'Lin', team: 'Frontend', progress: '62%' },
  { id: 3, name: 'Auth Gateway', owner: 'Kai', team: 'Backend', progress: '88%' },
]

const rows = ref<typeof allRows>([])
const loading = ref(true)

function reload() {
  loading.value = true
  rows.value = []
  window.setTimeout(() => {
    rows.value = allRows
    loading.value = false
  }, 1500)
}

reload()
</script>

<template>
  <div style="display: grid; gap: 12px">
    <div>
      <MButton size="small" @click="reload">Reload</MButton>
    </div>
    <MTable
      :columns="columns"
      :rows="rows"
      :skeleton="loading"
      :skeleton-rows="4"
      bordered
      striped
    />
  </div>
</template>
