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
      Scroll demo
    </MLayoutHeader>
    <MLayout has-sider>
      <MLayoutSider bordered :width="120" content-style="padding:0.75rem">
        固定侧栏
      </MLayoutSider>
      <MLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            行 {{ n }} — 向下滚动
          </div>
        </div>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
