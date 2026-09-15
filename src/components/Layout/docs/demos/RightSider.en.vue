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
      <MLayoutSider bordered :width="140" content-style="padding:0.75rem">
        Props panel
      </MLayoutSider>
      <MLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
