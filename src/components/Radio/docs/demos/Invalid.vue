<script setup lang="ts">
import { MRadio } from 'morya-ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <MRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
