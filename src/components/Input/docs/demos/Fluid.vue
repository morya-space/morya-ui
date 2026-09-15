<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4 w-full">
    <MInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <MInput variant="filled" label="Filled" placeholder="Filled" />
    <MInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
