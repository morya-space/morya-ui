<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
import { ref } from 'vue'

const ok = ref(false)
</script>

<template>
  <MCheckbox v-model="ok" class="terms-row" label="I agree" />
</template>
