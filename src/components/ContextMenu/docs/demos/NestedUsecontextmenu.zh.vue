<script setup lang="ts">
import { MContextMenu, useContextMenu } from 'morya-ui'

const menu = useContextMenu()
const model = [
  { label: '复制', command: () => undefined },
  { label: '更多', items: [{ label: '深层' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    @contextmenu="menu.show"
  >
    右键此处（composable）
  </div>
  <MContextMenu v-model="menu.visible" v-model:position="menu.position" :model="model" />
</template>
