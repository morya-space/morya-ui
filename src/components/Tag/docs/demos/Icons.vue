<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="New" icon="plus" severity="info" />
    <MTag value="Done" icon="check" severity="success" />
    <MTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
