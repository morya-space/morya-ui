<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="Primary" />
    <MTag value="Secondary" severity="secondary" />
    <MTag value="Success" severity="success" />
    <MTag value="Info" severity="info" />
    <MTag value="Warn" severity="warn" />
    <MTag value="Danger" severity="danger" />
    <MTag value="Contrast" severity="contrast" />
  </div>
</template>
