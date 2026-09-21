<script setup lang="ts">
import {
  MButton,
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
  MMenu,
  MTag,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  { key: 'datasources', label: '数据源', icon: 'database' },
  { key: 'widgets', label: '组件', icon: 'components' },
  { key: 'theme', label: '主题', icon: 'palette' },
]
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
        collapse-mode="width"
        :width="168"
        :collapsed-width="56"
      >
        <MMenu
          v-model:selected-key="selectedKey"
          :model="model"
          :collapsed="collapsed"
          :collapsed-width="56"
          inverted
        />
      </MLayoutSider>

      <MLayout>
        <MLayoutContent embedded style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>工作区</strong>
          <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
            当前选中：{{ selectedKey }}。Content 已撑满 Header 与 Footer 之间的空间；侧栏折叠不影响主区高度。
          </p>
        </MLayoutContent>
        <MLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--m-color-text-muted);font-size:0.75rem">
          Ready · local
        </MLayoutFooter>
      </MLayout>
    </MLayout>
  </MLayout>
</template>
