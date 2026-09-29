<script setup lang="ts">
import { MImage, MImagePreviewGroup } from 'morya-ui'
</script>

<template>
  <MImagePreviewGroup>
    <MImage
      src="https://picsum.photos/seed/morya-1/200/140"
      alt="图 1"
      :width="160"
      :height="110"
    />
    <MImage
      src="https://picsum.photos/seed/morya-2/200/140"
      alt="图 2"
      :width="160"
      :height="110"
    />
    <MImage
      src="https://picsum.photos/seed/morya-3/200/140"
      alt="图 3"
      :width="160"
      :height="110"
    />
  </MImagePreviewGroup>
</template>
