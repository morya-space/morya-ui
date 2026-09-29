<script setup lang="ts">
import { MDivider } from 'morya-ui'
</script>

<template>
  <div class="grid gap-1rem w-full">
    <p>默认标签偏标题样式。</p>
    <MDivider label="Section" />
    <p>plain 使用正文样式。</p>
    <MDivider plain label="Plain text" />
    <MDivider plain align="left" label="Left plain" />
  </div>
</template>
