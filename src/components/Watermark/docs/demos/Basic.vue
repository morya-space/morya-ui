<script setup lang="ts">
import { MWatermark } from 'morya-ui'
</script>

<template>
  <MWatermark content="Morya UI">
    <div
      style="
        height: 200px;
        padding: var(--m-space-6);
        background: var(--m-color-surface-raised);
        border-radius: var(--m-radius-md);
      "
    >
      带水印的内容区域
    </div>
  </MWatermark>
</template>
