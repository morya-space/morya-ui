<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton
      label="Success"
      severity="success"
      @click="toast.success({ summary: 'Saved', detail: 'Your changes are live.' })"
    />
    <MButton
      label="Info"
      severity="info"
      @click="toast.info({ summary: 'Tip', detail: 'You can continue.' })"
    />
    <MButton
      label="Warn"
      severity="warn"
      @click="toast.warn({ summary: 'Caution', detail: 'Please double-check.' })"
    />
    <MButton
      label="Error"
      severity="danger"
      @click="toast.error({ summary: 'Failed', detail: 'Try again later.' })"
    />
  </div>
</template>
