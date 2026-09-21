<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
</script>

<template>
  <MLayout style="height:14rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </MLayoutHeader>
    <MLayout has-sider sider-placement="right">
      <MLayoutSider bordered :width="140" style="padding:0.75rem">
        属性面板
      </MLayoutSider>
      <MLayoutContent embedded style="padding:1rem">
        画布 / 主区域
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
