<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
const dialogRef = ref<InstanceType<typeof MDialog> | null>(null)

function reset() {
  dialogRef.value?.resetPosition()
}
</script>

<template>
  <MButton label="打开可拖拽对话框" @click="visible = true" />
  <MDialog ref="dialogRef" v-model="visible" title="拖拽我" draggable width="32rem">
    <p>按住标题栏拖动。</p>
    <p>默认拖不出可视区，加 <code>overflow</code> 可放宽。</p>
    <p>
      <MButton label="重置位置" size="sm" @click="reset" />
    </p>
  </MDialog>
</template>
