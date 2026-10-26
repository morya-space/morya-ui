<script setup lang="ts">
import { MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter layout="vertical" style="min-height: 10rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 1rem">Panel 1</div>
    </template>
    <template #panel2>
      <div style="padding: 1rem">Panel 2</div>
    </template>
  </MSplitter>
</template>
