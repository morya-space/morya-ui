<script setup lang="ts">
import { MDivider } from 'morya-ui'
</script>

<template>
  <div class="flex items-stretch gap-1rem min-h-6rem">
    <span>Left</span>
    <MDivider layout="vertical" />
    <span>Middle</span>
    <MDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
