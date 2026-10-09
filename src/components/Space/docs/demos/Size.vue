<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4">
    <MSpace size="small">
      <MButton label="small" size="small" />
      <MButton label="small" size="small"/>
    </MSpace>
    <MSpace size="medium">
      <MButton label="medium" size="small" />
      <MButton label="medium" size="small"/>
    </MSpace>
    <MSpace size="large">
      <MButton label="large" size="small" />
      <MButton label="large" size="small"/>
    </MSpace>
    <MSpace :size="20">
      <MButton label="20px" size="small" />
      <MButton label="20px" size="small"/>
    </MSpace>
  </div>
</template>
