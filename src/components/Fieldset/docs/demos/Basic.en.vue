<script setup lang="ts">
import { MFieldset } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MFieldset legend="Account" toggleable :collapsed="collapsed" @update:collapsed="collapsed = $event">
    <p style="margin:0">
      Field group content.
    </p>
  </MFieldset>
</template>
