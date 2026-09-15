<script setup lang="ts">
import { MButton, MDropdown } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { type: 'group' as const, label: 'Edit', items: [{ value: 'cut', label: 'Cut' }, { value: 'copy', label: 'Copy' }] },
  { separator: true },
  { value: 'more', label: 'More', items: [{ value: 'deep', label: 'Deep action' }] },
]
</script>

<template>
  <MDropdown v-model="open" :items="items" trigger="hover" :show-delay="0" :hide-delay="200">
    <template #trigger>
      <MButton label="Hover to open" severity="secondary" />
    </template>
  </MDropdown>
</template>
