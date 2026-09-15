<script setup lang="ts">
import { MContextMenu } from 'morya-ui'

const model = [
  { label: '复制' },
  { label: '粘贴' },
  { separator: true },
  { label: '删除', disabled: true },
]
</script>

<template>
  <MContextMenu :model="model">
    <div
      style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    >
      右键此处打开菜单
    </div>
  </MContextMenu>
</template>
