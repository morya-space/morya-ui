<script setup lang="ts">
import { MButton, MConfigProvider, MDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <MConfigProvider input-variant="filled" append-to="body">
    <div class="flex flex-wrap gap-3 items-center">
      <MSelect v-model="city" :options="options" placeholder="filled 输入" class="w-48" />
      <MButton label="打开对话框" @click="visible = true" />
    </div>
    <MDialog v-model="visible" title="继承 appendTo" class="w-96">
      <p style="margin:0">
        浮层挂载目标由 ConfigProvider 提供。
      </p>
    </MDialog>
  </MConfigProvider>
</template>
