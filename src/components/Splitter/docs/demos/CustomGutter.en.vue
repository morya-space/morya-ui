<script setup lang="ts">
import { MIcon, MSplitter } from 'morya-ui'
</script>

<template>
  <MSplitter
    :resize-trigger-size="14"
    resize-trigger-class="doc-splitter-gutter"
    :resize-trigger-style="{
      background: 'color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface))',
      borderInline: '1px solid var(--m-color-border)',
    }"
    style="min-height: 8rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden"
  >
    <template #panel1>
      <div style="padding: 0.75rem">Panel A — custom gutter</div>
    </template>
    <template #resize-trigger>
      <MIcon name="grip" size="sm" style="color: var(--m-color-text-muted)" />
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">Panel B</div>
    </template>
  </MSplitter>
</template>
