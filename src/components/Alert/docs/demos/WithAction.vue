<script setup lang="ts">
import { MAlert, MButton, message } from 'morya-ui'

function onUndo() {
  message.info('已撤销')
}
</script>

<template>
  <MAlert severity="info">
    <template #title>
      已归档
    </template>
    该记录已移入归档。你可以撤销此次操作。
    <template #action>
      <MButton
        size="small"
        text
        @click="onUndo"
      >
        撤销
      </MButton>
    </template>
  </MAlert>
</template>
