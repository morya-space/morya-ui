<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('a1')
const model = [
  { key: 'a', label: 'Module A', items: [{ key: 'a1', label: 'A-1' }] },
  { key: 'b', label: 'Module B', items: [{ key: 'b1', label: 'B-1' }] },
]
</script>

<template>
  <div
    style="
      width: 14rem;
      padding: var(--m-space-3);
      background: var(--m-color-surface);
      border: 1px solid var(--m-color-border);
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
    "
  >
    <MMenu v-model:selected-key="selectedKey" :model="model" accordion embedded />
  </div>
</template>
