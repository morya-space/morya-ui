<script setup lang="ts">
import { MButton, message, MIcon } from 'morya-ui'
import { h } from 'vue'

function showVNode() {
  message.info({
    content: () =>
      h('span', [
        h(MIcon, { name: 'check-circle', size: 'sm' }),
        ' Built with ',
        h('strong', 'h()'),
        ' render',
      ]),
    life: 4000,
  })
}
</script>

<template>
  <MButton label="VNode content" @click="showVNode" />
</template>
