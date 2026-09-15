<script setup lang="ts">
import type {FileUploadFile} from 'morya-ui';
import {  MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const preview = ref('')
function onPreview(file: FileUploadFile) {
  preview.value = file.url ?? ''
}
</script>

<template>
  <div class="flex flex-col gap-3 max-w-md">
    <MFileUpload multiple accept="image/*" list-type="picture" @preview="onPreview" />
    <img v-if="preview" :src="preview" alt="" class="max-w-48 rounded-lg">
  </div>
</template>
