<script setup lang="ts">
import { MButton, MEmpty } from 'morya-ui'
</script>

<template>
  <MEmpty
    title="还没有课程"
    description="创建第一门课程后，学员就能在目录里看到它。也可以稍后从模板导入。"
    icon="book"
  >
    <template #extra>
      <MButton label="创建第一门课程" />
      <MButton label="从模板导入" severity="secondary" text />
    </template>
  </MEmpty>
</template>
