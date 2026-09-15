<script setup lang="ts">
import { MInputPassword } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MInputPassword v-model="value" label="Password" />
</template>
