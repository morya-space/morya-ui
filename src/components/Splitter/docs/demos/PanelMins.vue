<script setup lang="ts">
import { MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter
    :size="40"
    :min="20"
    :min2="30"
    style="height: 10rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md)"
  >
    <template #panel1>
      <div style="padding: var(--m-space-3)">panel1 min 20%</div>
    </template>
    <template #panel2>
      <div style="padding: var(--m-space-3)">panel2 min2 30%</div>
    </template>
  </MSplitter>
</template>
