<script setup lang="ts">
import type {FileUploadRequestOptions} from 'morya-ui';
import {  MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const last = ref('')

async function mockUpload(options: FileUploadRequestOptions) {
  options.onProgress(35)
  await new Promise((resolve) => setTimeout(resolve, 400))
  options.onProgress(100)
  return { name: options.file.name }
}

function onSuccess(_file: unknown, response: unknown) {
  last.value = JSON.stringify(response)
}
</script>

<template>
  <div class="flex flex-col gap-3 max-w-md">
    <MFileUpload drag multiple :http-request="mockUpload" @success="onSuccess">
      <template #tip>
        Files upload immediately after selection, with progress.
      </template>
    </MFileUpload>
    <div v-if="last">
      Response: {{ last }}
    </div>
  </div>
</template>
