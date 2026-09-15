<script setup lang="ts">
import { MButton, MConfigProvider, MDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MConfigProvider append-to="body" :z-index="2200">
    <MButton label="Open dialog" @click="visible = true" />
    <MDialog v-model="visible" header="Mounted to body" width="24rem">
      <p style="margin:0">
        Overlays Teleport to body by default. The z-index base comes from ConfigProvider.
      </p>
    </MDialog>
  </MConfigProvider>
</template>
