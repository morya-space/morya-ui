<script setup lang="ts">
import { MContextMenu, useContextMenu } from 'morya-ui'

const menu = useContextMenu()
const model = [
  { label: 'Copy', command: () => undefined },
  { label: 'More', items: [{ label: 'Nested' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    @contextmenu="menu.show"
  >
    Right-click here (composable)
  </div>
  <MContextMenu v-model="menu.visible" v-model:position="menu.position" :model="model" />
</template>
