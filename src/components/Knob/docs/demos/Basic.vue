<script setup lang="ts">
import { MKnob } from 'morya-ui'
import { ref } from 'vue'

const value = ref(60)
</script>

<template>
  <MKnob v-model="value" :size="120" value-template="{value}%" />
</template>
