<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="Mask Closable" @click="open = true" />
    <MDialog v-model="open" title="Mask closable" close-on-outside-click>
      <p style="margin:0">
        Click the mask — the dialog closes. Without `close-on-outside-click` it stays open.
      </p>
    </MDialog>
  </div>
</template>
