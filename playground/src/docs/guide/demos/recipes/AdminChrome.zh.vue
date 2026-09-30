<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
  MMenu,
  MTag,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKey = ref('overview')
const model = [
  { key: 'overview', label: '概览', icon: 'layout-dashboard' },
  { key: 'orders', label: '订单', icon: 'list' },
  { key: 'settings', label: '设置', icon: 'settings' },
]
</script>

<template>
  <MLayout
    style="height:17rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden"
  >
    <MLayoutHeader
      bordered
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Acme Admin</strong>
      <MTag value="预览" />
      <span style="flex:1" />
      <span style="color:var(--m-color-text-muted);font-size:0.75rem">
        {{ collapsed ? '侧栏已折叠' : '侧栏已展开' }}
      </span>
    </MLayoutHeader>

    <MLayout has-sider>
      <MLayoutSider
        v-model:collapsed="collapsed"
        bordered
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
        />
      </MLayoutSider>

      <MLayoutContent embedded style="padding:1rem;display:grid;gap:0.5rem;align-content:start">
        <strong>内容区</strong>
        <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
          当前路由占位：{{ selectedKey }}。生产里把主内容换成页面路由出口即可。
        </p>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
