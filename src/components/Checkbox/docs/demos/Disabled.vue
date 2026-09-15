<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
</script>

<template>
  <div class="flex flex-col gap-3">
    <MCheckbox :model-value="true" disabled label="Checked disabled" />
    <MCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
