<script setup lang="ts">
import { MTree } from 'morya-ui'
import { ref } from 'vue'

const checkedKeys = ref<Record<string, boolean>>({})
const nodes = [
  {
    key: '0',
    label: 'Documents',
    children: [
      { key: '0-0', label: 'Work' },
      { key: '0-1', label: 'Home' },
    ],
  },
]
</script>

<template>
  <div style="display:grid;gap:0.5rem">
    <MTree
      v-model:checked-keys="checkedKeys"
      :value="nodes"
      show-checkbox
      check-strategy="child"
      default-expand-all
    />
    <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
      keys: {{ Object.keys(checkedKeys).join(', ') || '(none)' }}
    </p>
  </div>
</template>
