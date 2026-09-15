<script setup lang="ts">
import { MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="success" />
    <MResult status="info" description="这是一条补充说明。" />
  </div>
</template>
