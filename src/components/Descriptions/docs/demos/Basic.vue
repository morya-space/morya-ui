<script setup lang="ts">
import { MDescriptions, MDescriptionsItem } from 'morya-ui'
</script>

<template>
  <MDescriptions
    title="用户信息"
    :column="3"
  >
    <template #extra>
      <a href="#edit">编辑</a>
    </template>
    <MDescriptionsItem
      label="姓名"
      :span="2"
    >
      张三
    </MDescriptionsItem>
    <MDescriptionsItem label="电话">
      138****0000
    </MDescriptionsItem>
    <MDescriptionsItem label="居住地">
      杭州
    </MDescriptionsItem>
    <MDescriptionsItem
      label="备注"
      :span="2"
    >
      无
    </MDescriptionsItem>
  </MDescriptions>
</template>
