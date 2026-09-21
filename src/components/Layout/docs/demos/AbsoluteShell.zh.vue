<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayout position="absolute" has-sider>
      <MLayoutSider bordered :width="120" style="padding:0.75rem">
        Nav
      </MLayoutSider>
      <MLayout>
        <MLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </MLayoutHeader>
        <MLayoutContent embedded style="padding:1rem">
          填满相对定位容器
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </div>
</template>
