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
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'datasources', label: 'Datasources', icon: 'database' },
  { key: 'widgets', label: 'Widgets', icon: 'components' },
  { key: 'theme', label: 'Theme', icon: 'palette' },
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
      <MButton size="small" label="Publish" />
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
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
            Selected: {{ selectedKey }}. Content fills the space between Header and Footer; collapsing the sider keeps the height.
          </p>
        </MLayoutContent>
        <MLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--m-color-text-muted);font-size:0.75rem">
          Ready · local
        </MLayoutFooter>
      </MLayout>
    </MLayout>
  </MLayout>
</template>
