<script setup lang="ts">
import { MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter disabled :size="40" style="min-height: 7rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding:0.75rem">
        Not draggable
      </div>
    </template>
    <template #panel2>
      <div style="padding:0.75rem">
        B
      </div>
    </template>
  </MSplitter>
</template>
