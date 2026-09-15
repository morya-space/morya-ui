<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')

function blurInput(event: KeyboardEvent) {
  ;(event.target as HTMLInputElement | null)?.blur()
}
</script>

<template>
  <MInput
    v-model="code"
    label="验证码"
    :maxlength="6"
    @keydown.enter="blurInput"
  />
</template>
