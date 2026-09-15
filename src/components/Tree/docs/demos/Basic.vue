<script setup lang="ts">
import { MTree } from 'morya-ui'
import { ref } from 'vue'

const selected = ref<string | null>(null)
const nodes = [
  {
    key: '0',
    label: 'Documents',
    icon: 'menu',
    children: [
      { key: '0-0', label: 'Work', icon: 'edit' },
      { key: '0-1', label: 'Home', icon: 'home' },
    ],
  },
]
</script>

<template>
  <MTree v-model="selected" :value="nodes" default-expand-all />
</template>
