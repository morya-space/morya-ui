<script setup lang="ts">
import { MInputOtp } from 'morya-ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <MInputOtp v-model="code" :length="4" integer-only />
</template>
