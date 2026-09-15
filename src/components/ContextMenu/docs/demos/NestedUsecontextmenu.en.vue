<script setup lang="ts">
import { MContextMenu, useContextMenu } from 'morya-ui'

const { visible, position, show } = useContextMenu()
const model = [
  { label: 'Copy', command: () => undefined },
  { label: 'More', items: [{ label: 'Nested' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    @contextmenu="show"
  >
    Right-click here (composable)
  </div>
  <MContextMenu v-model="visible" v-model:position="position" :model="model" />
</template>
