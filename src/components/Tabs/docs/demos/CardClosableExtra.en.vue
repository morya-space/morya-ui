<script setup lang="ts">
import { MButton, MTabs } from 'morya-ui'
import { ref } from 'vue'

const active = ref('a')
const tabs = ref([
  { label: 'Design', value: 'a' },
  { label: 'Data', value: 'b' },
  { label: 'Ship', value: 'c' },
])

function onClose(value: string) {
  tabs.value = tabs.value.filter((tab) => tab.value !== value)
}

function onAdd() {
  const value = `tab-${tabs.value.length + 1}`
  tabs.value = [...tabs.value, { label: `Tab ${tabs.value.length + 1}`, value }]
  active.value = value
}
</script>

<template>
  <MTabs
    v-model="active"
    type="card"
    closable
    addable
    :tabs="tabs"
    @close="onClose"
    @add="onAdd"
  >
    <template #extra>
      <MButton label="Action" size="small" severity="secondary" />
    </template>
    <template #default="{ activeValue }">
      <p style="margin:0">
        {{ activeValue }}
      </p>
    </template>
  </MTabs>
</template>
