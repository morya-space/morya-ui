<script setup lang="ts">
import { MTextarea } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Line 1\nLine 2')
const limited = ref('Clamped height')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <MTextarea v-model="value" autosize label="Auto resize" />
    <MTextarea v-model="limited" :autosize="{ minRows: 3, maxRows: 6 }" label="min 3 / max 6" />
    <MTextarea invalid label="Required" help-text="This field is required" model-value="" />
  </div>
</template>
