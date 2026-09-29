<script setup lang="ts">
import { MDescriptions, MDescriptionsItem } from 'morya-ui'
</script>

<template>
  <MDescriptions
    title="订单"
    bordered
    layout="vertical"
    :column="2"
  >
    <MDescriptionsItem label="单号">
      SO-20260329
    </MDescriptionsItem>
    <MDescriptionsItem label="状态">
      已发货
    </MDescriptionsItem>
    <MDescriptionsItem
      label="地址"
      :span="2"
    >
      浙江省杭州市西湖区
    </MDescriptionsItem>
  </MDescriptions>
</template>
