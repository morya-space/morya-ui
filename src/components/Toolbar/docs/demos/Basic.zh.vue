<script setup lang="ts">
import { MButton, MToolbar } from 'morya-ui'
</script>

<template>
  <MToolbar>
    <template #start>
      <MButton label="新建" size="small" />
    </template>
    <template #center>
      <span>工具栏</span>
    </template>
    <template #end>
      <MButton label="导出" severity="secondary" size="small" />
    </template>
  </MToolbar>
</template>
