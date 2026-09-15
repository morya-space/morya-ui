<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <MCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
