<script setup lang="ts">
import { MPanel } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MPanel v-model="collapsed" header="Panel" toggleable class="w-[300px]">
    <p style="margin:0">
      可折叠面板内容。
    </p>
    <template #footer>
      操作区
    </template>
  </MPanel>
</template>
