<script setup lang="ts">
import { MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const uploader = ref<{
  openPicker: () => void
  submit: () => void
  abort: () => void
  clear: () => void
  clearFiles: () => void
} | null>(null)
</script>

<template>
  <div class="flex flex-col gap-3 max-w-md">
    <MFileUpload ref="uploader" mode="advanced" :auto-upload="false" />
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <button type="button" @click="uploader?.openPicker()">
        Choose
      </button>
      <button type="button" @click="uploader?.submit()">
        Submit queue
      </button>
      <button type="button" @click="uploader?.abort()">
        Abort
      </button>
      <button type="button" @click="uploader?.clear()">
        Clear
      </button>
      <button type="button" @click="uploader?.clearFiles()">
        Clear alias
      </button>
    </div>
  </div>
</template>
