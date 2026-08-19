<script setup lang="ts">
</script>

<template>
  <div class="wd-toolbar" role="toolbar">
    <div v-if="$slots.start" class="wd-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="wd-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="wd-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
