<script setup lang="ts">
import { MRadio, MRadioGroup } from 'morya-ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <MRadioGroup v-model="size">
    <MRadio value="sm" label="Small" />
    <MRadio value="md" label="Medium" />
    <MRadio value="lg" label="Large" />
  </MRadioGroup>
</template>
