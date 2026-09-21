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
      <MLayoutSider bordered :width="120" style="padding:0.75rem">
        Fixed sider
      </MLayoutSider>
      <MLayoutContent embedded style="padding:1rem;overflow:auto;min-height:0">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
