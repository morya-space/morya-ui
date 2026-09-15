<script setup lang="ts">
import { MRadio } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio model-value="a" value="a" disabled label="Selected" />
    <MRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
