<script setup lang="ts">
import { MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="success" />
    <MResult status="info" description="Additional context for this outcome." />
  </div>
</template>
