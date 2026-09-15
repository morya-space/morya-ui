<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInput
    v-model="code"
    label="验证码"
    maxlength="6"
    @keydown.enter="$event.target instanceof HTMLInputElement && $event.target.blur()"
  />
</template>
