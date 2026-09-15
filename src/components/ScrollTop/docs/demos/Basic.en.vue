<script setup lang="ts">
import { MScrollbar, MScrollTop } from 'morya-ui'
</script>

<template>
  <div style="height: 8rem; position: relative">
    <MScrollbar height="8rem">
      <div style="height: 40rem; padding: var(--m-space-3)">
        Scroll down…
      </div>
      <MScrollTop :threshold="80" target="parent" :right="16" :bottom="16" />
    </MScrollbar>
  </div>
</template>
