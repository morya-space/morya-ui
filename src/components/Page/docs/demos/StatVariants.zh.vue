<script setup lang="ts">
import { MGrid, MGridItem, MPageContent, MPageStat } from 'morya-ui'
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:visible;background:var(--m-color-surface)"
  >
    <MPageContent density="compact">
      <MGrid :cols="2" :x-gap="16" :y-gap="12" responsive="screen">
        <MGridItem :span="1">
          <MPageStat
            label="今日订单"
            value="1,284"
            trend="+6.1%"
            trend-direction="up"
            trend-severity="success"
            layout="plain"
            orientation="inline"
            density="compact"
          />
        </MGridItem>
        <MGridItem :span="1">
          <MPageStat
            label="待处理"
            value="47"
            layout="plain"
            orientation="inline"
            density="compact"
          />
        </MGridItem>
        <MGridItem :span="2">
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
        </MGridItem>
      </MGrid>
    </MPageContent>
  </div>
</template>
