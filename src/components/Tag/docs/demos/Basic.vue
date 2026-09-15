<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="Primary" />
    <MTag>Slot Label</MTag>
    <MTag value="Rounded" rounded />
  </div>
</template>
