<script setup lang="ts">
import { MContextMenu, useContextMenu } from 'morya-ui'

const { visible, position, show } = useContextMenu()
const model = [
  { label: '复制', command: () => undefined },
  { label: '更多', items: [{ label: '嵌套项' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    @contextmenu="show"
  >
    在此右键（组合式 API）
  </div>
  <MContextMenu v-model="visible" v-model:position="position" :model="model" />
</template>
