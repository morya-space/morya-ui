<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Success" @click="toast.success({ summary: 'Saved', detail: 'Your changes are live.' })" color="success" variant="solid"/>
    <MButton label="Info" @click="toast.info({ summary: 'Tip', detail: 'You can continue.' })" color="info" variant="solid"/>
    <MButton label="Warn" @click="toast.warn({ summary: 'Caution', detail: 'Please double-check.' })" color="warning" variant="solid"/>
    <MButton label="Error" @click="toast.error({ summary: 'Failed', detail: 'Try again later.' })" danger type="primary"/>
  </div>
</template>
