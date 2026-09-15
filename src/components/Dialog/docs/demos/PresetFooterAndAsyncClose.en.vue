<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)

async function save() {
  await new Promise((resolve) => setTimeout(resolve, 400))
}
</script>

<template>
  <div>
    <MButton label="Save dialog" @click="open = true" />
    <MDialog
      v-model="open"
      header="Save changes"
      type="info"
      positive-text="Save"
      negative-text="Cancel"
      :on-positive-click="save"
      :before-close="() => true"
      width="28rem"
    >
      <p style="margin:0">
        The close button, Esc, and mask run <code>beforeClose</code>; Save runs <code>onPositiveClick</code>.
      </p>
    </MDialog>
  </div>
</template>
