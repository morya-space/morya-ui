<script setup lang="ts">
import { MButton, MCommandMenu } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
const model = [
  { label: '新建文件', icon: '+', shortcut: '⌘N', command: () => window.alert('新建') },
  { label: '打开设置', icon: '⚙', shortcut: '⌘,', command: () => window.alert('设置') },
  { label: '切换主题', icon: '◐', disabled: true },
]
</script>

<template>
  <MButton label="打开命令面板" @click="visible = true" />
  <MCommandMenu v-model="visible" :model="model" placeholder="搜索命令…" />
</template>
