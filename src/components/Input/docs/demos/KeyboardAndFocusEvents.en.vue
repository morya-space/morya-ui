<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInput
    v-model="code"
    label="Code"
    maxlength="6"
    @keydown.enter="$event.target instanceof HTMLInputElement && $event.target.blur()"
  />
</template>
