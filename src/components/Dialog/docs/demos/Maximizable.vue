<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="Maximizable" @click="open = true" />
    <MDialog v-model="open" header="Workspace" maximizable width="32rem">
      <p style="margin:0">
        Toggle maximize to fill the viewport.
      </p>
    </MDialog>
  </div>
</template>
