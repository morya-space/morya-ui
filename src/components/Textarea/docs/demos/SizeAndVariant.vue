<script setup lang="ts">
import { MTextarea } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <MTextarea size="small" label="Small" :rows="3" />
    <MTextarea variant="filled" label="Filled" :rows="3" />
    <MTextarea size="large" fluid label="Large Fluid" :rows="3" />
  </div>
</template>
