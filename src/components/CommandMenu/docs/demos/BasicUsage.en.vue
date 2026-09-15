<script setup lang="ts">
import { MButton, MCommandMenu } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
const model = [
  { label: 'New file', icon: '+', shortcut: '⌘N', command: () => window.alert('New') },
  { label: 'Open settings', icon: '⚙', shortcut: '⌘,', command: () => window.alert('Settings') },
  { label: 'Toggle theme', icon: '◐', disabled: true },
]
</script>

<template>
  <MButton label="Open command menu" @click="visible = true" />
  <MCommandMenu v-model="visible" :model="model" placeholder="Search commands…" />
</template>
