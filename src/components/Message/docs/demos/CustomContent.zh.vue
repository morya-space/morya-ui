<script setup lang="ts">
import { MButton, message, MIcon } from 'morya-ui'
import { h } from 'vue'

function showVNode() {
  message.info({
    content: () =>
      h('span', [
        h(MIcon, { name: 'check-circle', size: 'sm' }),
        ' 已用 ',
        h('strong', 'h()'),
        ' 渲染',
      ]),
    life: 4000,
  })
}
</script>

<template>
  <MButton label="VNode 内容" @click="showVNode" />
</template>
