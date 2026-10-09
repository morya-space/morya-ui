<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MFlex } from 'morya-ui'

const loading = ref(false)

function toggle() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton type="primary" label="Always" loading />
    <MButton label="Delayed" :loading="{ delay: 400 }" />
    <MButton type="primary" :loading="loading" label="Click me" @click="toggle" />
  </MFlex>
</template>
