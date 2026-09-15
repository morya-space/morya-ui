<script setup lang="ts">
import { MBlockUI, MButton } from 'morya-ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <MButton :label="blocked ? '解除' : '锁定'" @click="blocked = !blocked" />
  <MBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>面板内容</p>
  </MBlockUI>
</template>
