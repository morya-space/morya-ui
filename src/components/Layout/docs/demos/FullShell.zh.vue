<script setup lang="ts">
import {
  MButton,
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
  MTag,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MLayout style="height:18rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Morya UI</strong>
      <MTag value="Studio" />
      <span style="flex:1" />
      <MButton size="small" label="发布" />
    </MLayoutHeader>

    <MLayout has-sider>
      <MLayoutSider
        v-model:collapsed="collapsed"
        bordered
        inverted
        show-trigger="bar"
        :width="168"
        :collapsed-width="56"
        content-style="padding:0.75rem"
      >
        <div style="display:grid;gap:0.65rem;font-size:0.875rem">
          <div>仪表盘</div>
          <div>数据源</div>
          <div>组件</div>
          <div>主题</div>
        </div>
      </MLayoutSider>

      <MLayout>
        <MLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>工作区</strong>
          <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
            Content 已撑满 Header 与 Footer 之间的空间；侧栏折叠不影响主区高度。
          </p>
        </MLayoutContent>
        <MLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--m-color-text-muted);font-size:0.75rem">
          Ready · local
        </MLayoutFooter>
      </MLayout>
    </MLayout>
  </MLayout>
</template>
