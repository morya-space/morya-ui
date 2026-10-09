<script setup lang="ts">
import { MButton, message } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Success" @click="message.success('Saved')" color="success" variant="solid"/>
    <MButton label="Info" @click="message.info('A short tip')" color="info" variant="solid"/>
    <MButton label="Warn" @click="message.warn('Please double-check')" color="warning" variant="solid"/>
    <MButton label="Error" @click="message.error('Request failed')" danger type="primary"/>
    <MButton
      label="Closable"
      @click="message.info({ content: 'Dismiss manually', closable: true, life: 0 })"
    />
  </div>
</template>
