<script setup lang="ts">
import { MSlider } from 'morya-ui'
import { ref } from 'vue'

const value = ref([20, 70])
</script>

<template>
  <div style="width:min(24rem,100%)">
    <MSlider v-model="value" range />
    <p style="margin:.5rem 0 0;color:var(--m-color-text-muted)">
      {{ value.join(' – ') }}
    </p>
  </div>
</template>
