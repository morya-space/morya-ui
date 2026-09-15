<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="No Mask Dismiss" severity="secondary" @click="open = true" />
    <MDialog v-model="open" header="Stay open" :dismissable-mask="false">
      <p style="margin:0">
        Click the mask — the dialog stays open. Use the close button or Esc.
      </p>
    </MDialog>
  </div>
</template>
