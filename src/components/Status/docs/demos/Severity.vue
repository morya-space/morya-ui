<script setup lang="ts">
import { MStatus } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MStatus label="Primary" severity="primary" />
    <MStatus label="Secondary" severity="secondary" />
    <MStatus label="Success" severity="success" />
    <MStatus label="Info" severity="info" />
    <MStatus label="Warn" severity="warn" />
    <MStatus label="Danger" severity="danger" />
    <MStatus label="Contrast" severity="contrast" />
  </div>
</template>
