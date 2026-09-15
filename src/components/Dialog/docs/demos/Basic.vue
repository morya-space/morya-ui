<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="Open Dialog" @click="open = true" />
    <MDialog v-model="open" header="Confirm" width="28rem">
      <p style="margin:0">
        Use <code>header</code> or <code>title</code> for the dialog title.
      </p>
    </MDialog>
  </div>
</template>
