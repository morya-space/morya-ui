<script setup lang="ts">
import { MSkeleton } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:0.75rem;width:min(24rem,100%)">
    <MSkeleton height="1.25rem" />
    <MSkeleton height="1.25rem" width="70%" />
    <MSkeleton height="6rem" border-radius="0.5rem" />
  </div>
</template>
