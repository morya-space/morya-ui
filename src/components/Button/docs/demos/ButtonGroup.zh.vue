<script setup lang="ts">
import { MButton, MButtonGroup } from 'morya-ui'
</script>

<template>
  <MButtonGroup aria-label="对齐">
    <MButton label="左" />
    <MButton label="中" severity="secondary" />
    <MButton label="右" severity="secondary" />
  </MButtonGroup>
</template>
