<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="Draft" closable bordered />
    <MTag value="Small" size="small" severity="success" closable />
  </div>
</template>
