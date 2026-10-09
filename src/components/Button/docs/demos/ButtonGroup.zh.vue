<script setup lang="ts">
import { MButton, MButtonGroup, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MButtonGroup aria-label="对齐">
      <MButton label="左" />
      <MButton label="中" />
      <MButton label="右" />
    </MButtonGroup>
    <MButtonGroup block aria-label="通栏组">
      <MButton label="取消" />
      <MButton type="primary" label="确认" />
    </MButtonGroup>
  </MFlex>
</template>
