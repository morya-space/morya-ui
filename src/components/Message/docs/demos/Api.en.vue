<script setup lang="ts">
import { MButton, message } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Success" severity="success" @click="message.success('Saved')" />
    <MButton label="Info" severity="info" @click="message.info('A short tip')" />
    <MButton label="Warn" severity="warn" @click="message.warn('Please double-check')" />
    <MButton label="Error" severity="danger" @click="message.error('Request failed')" />
    <MButton
      label="Closable"
      @click="message.info({ content: 'Dismiss manually', closable: true, life: 0 })"
    />
  </div>
</template>
