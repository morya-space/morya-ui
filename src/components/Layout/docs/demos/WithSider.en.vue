<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
  MMenu,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKey = ref('overview')
const model = [
  { key: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { key: 'projects', label: 'Projects', icon: 'folder' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <MLayout style="height:16rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--m-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
    </MLayoutHeader>
    <MLayout has-sider>
      <MLayoutSider
        v-model:collapsed="collapsed"
        bordered
        show-trigger="arrow-circle"
        collapse-mode="width"
        :width="168"
        :collapsed-width="64"
      >
        <MMenu
          v-model:selected-key="selectedKey"
          :model="model"
          :collapsed="collapsed"
          :collapsed-width="64"
        />
      </MLayoutSider>
      <MLayoutContent embedded style="padding:1rem">
        Selected: {{ selectedKey }}
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
