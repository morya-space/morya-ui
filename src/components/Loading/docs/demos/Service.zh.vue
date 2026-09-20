<script setup lang="ts">
import { MButton, useLoading } from 'morya-ui'
import { ref } from 'vue'

const panel = ref<HTMLElement>()
const { open } = useLoading()

function openRegion() {
  const instance = open({
    target: panel.value,
    text: '加载中',
    effect: 'wave',
  })
  window.setTimeout(() => instance.close(), 1600)
}

function openFullscreen() {
  const instance = open({
    text: '正在提交',
    effect: 'aurora',
    lock: true,
  })
  window.setTimeout(() => instance.close(), 1600)
}
</script>

<template>
  <div class="grid gap-4">
    <div
      ref="panel"
      class="min-h-32 rounded-md border border-solid border-[var(--m-color-border)] p-4"
    >
      可被服务盖住的区域
    </div>
    <div class="flex flex-wrap gap-3">
      <MButton label="区域加载" severity="secondary" @click="openRegion" />
      <MButton label="全屏加载" @click="openFullscreen" />
    </div>
  </div>
</template>
