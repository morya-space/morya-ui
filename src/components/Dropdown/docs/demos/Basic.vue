<script setup lang="ts">
import { MButton, MDropdown } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', disabled: true },
]

function onSelect(item: { value?: string; label?: string }) {
  open.value = false
  console.log(item.value)
}
</script>

<template>
  <MDropdown v-model="open" :items="items" @select="onSelect">
    <template #trigger>
      <MButton label="Actions" icon="chevron-down" icon-pos="right" severity="secondary" />
    </template>
  </MDropdown>
</template>
