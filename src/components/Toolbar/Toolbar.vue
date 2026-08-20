<script setup lang="ts">
</script>

<template>
  <div class="wi-toolbar" role="toolbar">
    <div v-if="$slots.start" class="wi-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="wi-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="wi-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
