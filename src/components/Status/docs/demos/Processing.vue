<script setup lang="ts">
import { MStatus } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MStatus label="Small" size="small" severity="success" />
    <MStatus label="Medium" severity="info" />
    <MStatus label="Large" size="large" severity="warn" />
    <MStatus label="Processing" severity="primary" processing />
  </div>
</template>
