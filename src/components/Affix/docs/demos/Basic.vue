<script setup lang="ts">
import { ref } from 'vue'
import { MAffix, MButton } from 'morya-ui'

const top = ref(80)
</script>

<template>
  <div style="height: 320px; overflow: auto; border: 1px solid var(--m-color-border); padding: var(--m-space-4);">
    <p>向下滚动，按钮在距顶部 {{ top }}px 时固定。</p>
    <div style="height: 120px" />
    <MAffix :offset-top="top">
      <MButton type="primary">
        Affix at {{ top }}px
      </MButton>
    </MAffix>
    <div style="height: 480px" />
  </div>
</template>
