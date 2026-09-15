<script setup lang="ts">
import { MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter direction="vertical" style="min-height: 10rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Top
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Bottom
      </div>
    </template>
  </MSplitter>
</template>
