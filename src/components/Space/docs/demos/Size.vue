<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4">
    <MSpace size="small">
      <MButton label="S" size="small" />
      <MButton label="S" size="small" severity="secondary" />
    </MSpace>
    <MSpace :size="20">
      <MButton label="20px" size="small" />
      <MButton label="20px" size="small" severity="secondary" />
    </MSpace>
    <MSpace size="1rem">
      <MButton label="1rem" size="small" />
      <MButton label="1rem" size="small" severity="secondary" />
    </MSpace>
  </div>
</template>
