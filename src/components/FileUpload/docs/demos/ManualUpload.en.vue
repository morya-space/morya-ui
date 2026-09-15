<script setup lang="ts">
import type {FileUploadFile} from 'morya-ui';
import {  MFileUpload } from 'morya-ui'

async function mockUpload() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ok: true }
}

function beforeUpload(file: File, _item: FileUploadFile) {
  if (file.size > 2 * 1024 * 1024) return false
  return true
}
</script>

<template>
  <MFileUpload
    mode="advanced"
    multiple
    :auto-upload="false"
    :max-size="2 * 1024 * 1024"
    :before-upload="beforeUpload"
    :http-request="mockUpload"
  >
    <template #tip>
      Each file must be under 2MB. Choose files, then click Upload.
    </template>
  </MFileUpload>
</template>
