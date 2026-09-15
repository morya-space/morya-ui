<script setup lang="ts">
import { MButton, MTabs } from 'morya-ui'
import { ref } from 'vue'

const active = ref('a')
const tabs = ref([
  { label: '设计', value: 'a' },
  { label: '数据', value: 'b' },
  { label: '发布', value: 'c' },
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
      <MButton label="操作" size="small" severity="secondary" />
    </template>
    <template #default="{ activeValue }">
      <p style="margin:0">
        {{ activeValue }}
      </p>
    </template>
  </MTabs>
</template>
