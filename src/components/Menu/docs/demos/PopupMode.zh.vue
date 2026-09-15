<script setup lang="ts">
import { MButton, MMenu } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const model = [
  { label: '复制', command: () => undefined },
  { separator: true },
  { label: '删除', disabled: true },
]
</script>

<template>
  <MMenu v-model="open" popup :model="model">
    <MButton label="更多操作" @click="open = !open" />
  </MMenu>
</template>
