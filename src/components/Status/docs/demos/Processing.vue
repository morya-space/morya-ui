<script setup lang="ts">
import { MStatus } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MStatus label="Small" size="small" type="success" />
    <MStatus label="Medium" type="info" />
    <MStatus label="Large" size="large" type="warning" />
    <MStatus label="Processing" type="primary" processing />
  </div>
</template>
