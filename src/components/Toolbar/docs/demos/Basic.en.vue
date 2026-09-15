<script setup lang="ts">
import { MButton, MToolbar } from 'morya-ui'
</script>

<template>
  <MToolbar>
    <template #start>
      <MButton label="New" size="small" />
    </template>
    <template #center>
      <span>Toolbar</span>
    </template>
    <template #end>
      <MButton label="Export" severity="secondary" size="small" />
    </template>
  </MToolbar>
</template>
