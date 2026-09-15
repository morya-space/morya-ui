<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'settings', label: 'Settings', icon: 'settings', disabled: true },
]
</script>

<template>
  <div
    style="
      width: 15rem;
      padding: var(--m-space-3);
      background: var(--m-color-surface);
      border: 1px solid var(--m-color-border);
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
    "
  >
    <MMenu
      v-model:selected-key="selectedKey"
      :model="model"
      embedded
      @select="(item) => console.log('select', item.key)"
    />
  </div>
</template>
