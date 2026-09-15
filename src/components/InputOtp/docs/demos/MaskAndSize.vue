<script setup lang="ts">
import { MInputOtp } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInputOtp v-model="code" :length="4" mask size="large" :gap="8" />
</template>
