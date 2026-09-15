<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
import { h } from 'vue'

function showRich() {
  toast.info({
    summary: () => h('span', [h('strong', 'Custom title')]),
    detail: () => h('em', 'Detail can be a VNode too'),
    life: 4000,
  })
}
</script>

<template>
  <MButton label="Rich Toast" @click="showRich" />
</template>
