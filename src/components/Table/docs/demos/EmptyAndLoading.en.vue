<script setup lang="ts">
import { MButton, MTable } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
</script>

<template>
  <div class="grid gap-3">
    <MButton :label="loading ? 'Stop loading' : 'Start loading'" @click="loading = !loading" />
    <MTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="No data yet"
      empty-description="Records will appear here after you create the first one"
      :paginator="false"
    />
  </div>
</template>
