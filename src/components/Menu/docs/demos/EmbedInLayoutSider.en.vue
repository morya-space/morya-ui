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
const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  {
    key: 'system',
    label: 'System',
    icon: 'settings',
    items: [
      { key: 'users', label: 'Users', icon: 'users' },
      { key: 'roles', label: 'Roles', icon: 'shield' },
    ],
  },
]
</script>

<template>
  <MLayout
    style="
      height: 14rem;
      border: 1px solid var(--m-color-border);
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
      overflow: hidden;
    "
  >
    <MLayoutHeader
      bordered
      style="
        padding: 0 var(--m-space-4);
        display: flex;
        align-items: center;
        min-height: var(--m-layout-header-height);
      "
    >
      <strong style="color: var(--m-color-primary); font-size: var(--m-font-size-md)">Morya UI</strong>
    </MLayoutHeader>
    <MLayout has-sider>
      <MLayoutSider
        v-model:collapsed="collapsed"
        bordered
        show-trigger="arrow-circle"
        collapse-mode="width"
        :collapsed-width="64"
      >
        <MMenu
          v-model:selected-key="selectedKey"
          :model="model"
          :collapsed="collapsed"
          :collapsed-width="64"
          accordion
        />
      </MLayoutSider>
      <MLayoutContent embedded style="padding: var(--m-space-4)">
        <p style="margin: 0; color: var(--m-color-text-muted); font-size: var(--m-font-size-sm)">
          Selected: <strong style="color: var(--m-color-text)">{{ selectedKey }}</strong>
        </p>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
