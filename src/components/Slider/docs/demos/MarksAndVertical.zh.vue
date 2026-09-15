<script setup lang="ts">
import { MSlider } from 'morya-ui'
import { ref } from 'vue'

const value = ref(50)
</script>

<template>
  <div style="display:flex;gap:2rem;align-items:stretch;height:10rem">
    <div style="flex:1">
      <MSlider v-model="value" tooltip :marks="{ 0: '0', 50: '半', 100: '满' }" />
    </div>
    <MSlider v-model="value" vertical tooltip />
  </div>
</template>
