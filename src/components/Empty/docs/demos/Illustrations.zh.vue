<script setup lang="ts">
import { MEmpty } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MEmpty
      illustration="no-content"
      title="暂无相关内容"
      description="这里还没有可展示的内容。"
    />
    <MEmpty
      illustration="no-result"
      title="搜索结果为空"
      description="试试调整关键词或筛选条件。"
    />
    <MEmpty
      illustration="no-message"
      title="没有新消息"
      description="有新动态时会第一时间通知你。"
    />
  </div>
</template>
