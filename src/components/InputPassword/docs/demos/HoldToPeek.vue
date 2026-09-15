<script setup lang="ts">
import { MInputPassword } from 'morya-ui'
import { ref } from 'vue'

const value = ref('secret')
</script>

<template>
  <MInputPassword v-model="value" label="Hold to peek" show-password-on="mousedown" />
</template>
