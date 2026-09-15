<script setup lang="ts">
import { MFloatLabel, MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MFloatLabel label="Username">
    <MInput v-model="value" placeholder=" " />
  </MFloatLabel>
</template>
