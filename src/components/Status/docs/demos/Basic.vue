<script setup lang="ts">
import { MStatus } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MStatus label="Idle" />
    <MStatus label="Online" severity="success" />
    <MStatus>From slot</MStatus>
  </div>
</template>
