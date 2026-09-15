<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
import { h } from 'vue'

function showRich() {
  toast.info({
    summary: () => h('span', [h('strong', '自定义标题')]),
    detail: () => h('em', '详情也可以是 VNode'),
    life: 4000,
  })
}
</script>

<template>
  <MButton label="富文本 Toast" @click="showRich" />
</template>
