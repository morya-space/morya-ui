<script setup lang="ts">
import { MInput, MLabel } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <MLabel html-for="demo-email">
      Email
    </MLabel>
    <MInput id="demo-email" placeholder="you@example.com" />
  </div>
</template>
