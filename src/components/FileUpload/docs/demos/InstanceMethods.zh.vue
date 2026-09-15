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
        选择文件
      </button>
      <button type="button" @click="uploader?.submit()">
        提交队列
      </button>
      <button type="button" @click="uploader?.abort()">
        取消上传
      </button>
      <button type="button" @click="uploader?.clear()">
        清空
      </button>
      <button type="button" @click="uploader?.clearFiles()">
        清空（别名）
      </button>
    </div>
  </div>
</template>
