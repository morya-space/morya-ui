<script setup lang="ts">
import { MPageContent, MPageStat } from 'morya-ui'
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent density="compact">
      <MPageStat
        label="总用户"
        value="12,480"
        trend="+8.2%"
        trend-direction="up"
        trend-label="较上月"
        trend-severity="success"
        icon="user"
        shadow="hover"
      />
      <MPageStat
        label="待处理工单"
        value="47"
        trend="-12%"
        loading
        icon="clipboard"
      />
    </MPageContent>
  </div>
</template>
