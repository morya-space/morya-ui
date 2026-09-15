<script setup lang="ts">
import { MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter style="min-height: 8rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Panel A — 拖中间分隔条
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Panel B
      </div>
    </template>
  </MSplitter>
</template>
