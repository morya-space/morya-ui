<script setup lang="ts">
import { MSwitch } from 'morya-ui'
</script>

<template>
  <div class="flex flex-col gap-3">
    <MSwitch :model-value="true" disabled label="On disabled" />
    <MSwitch :model-value="false" disabled label="Off disabled" />
  </div>
</template>
