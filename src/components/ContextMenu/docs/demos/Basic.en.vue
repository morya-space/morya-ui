<script setup lang="ts">
import { MContextMenu } from 'morya-ui'

const model = [
  { label: 'Copy' },
  { label: 'Paste' },
  { separator: true },
  { label: 'Delete', disabled: true },
]
</script>

<template>
  <MContextMenu :model="model">
    <div
      style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    >
      Right-click here to open the menu
    </div>
  </MContextMenu>
</template>
