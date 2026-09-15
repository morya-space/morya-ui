<script setup lang="ts">
import { MInputPassword } from 'morya-ui'
import { ref } from 'vue'

const value = ref('draft-pass')
</script>

<template>
  <MInputPassword v-model="value" label="Password" clearable show-count :maxlength="32" />
</template>
