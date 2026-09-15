<script setup lang="ts">
import { MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div class="flex flex-col gap-3 max-w-md">
    <MFileUpload drag multiple accept="image/*,.pdf" @select="onSelect">
      <template #tip>
        支持图片或 PDF，可一次拖入多个文件。
      </template>
    </MFileUpload>
    <div v-if="names.length">
      已选：{{ names.join(', ') }}
    </div>
  </div>
</template>
