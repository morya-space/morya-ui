<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--wi-space-6);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--wi-color-primary) 12%, transparent), transparent 55%),
    var(--wi-color-surface);
}
</style>
