<script setup lang="ts">
import { MDivider } from 'morya-ui'
</script>

<template>
  <div style="display:flex;align-items:stretch;gap:1rem;min-height:6rem">
    <span>Left</span>
    <MDivider layout="vertical" />
    <span>Middle</span>
    <MDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
