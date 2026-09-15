<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="With Footer" @click="open = true" />
    <MDialog v-model="open" header="Save changes" width="28rem">
      <p style="margin:0">
        Footer slot is for primary and secondary actions.
      </p>
      <template #footer>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
          <MButton label="Cancel" severity="secondary" text @click="open = false" />
          <MButton label="Confirm" @click="open = false" />
        </div>
      </template>
    </MDialog>
  </div>
</template>
