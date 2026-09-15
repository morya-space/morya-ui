<script setup lang="ts">
import { MLayout, MLayoutSider, MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  { key: 'users', label: '用户', icon: 'users' },
]
</script>

<template>
  <MLayout
    has-sider
    style="
      height: 10rem;
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
      overflow: hidden;
    "
  >
    <MLayoutSider inverted bordered class="w-48">
      <MMenu v-model:selected-key="selectedKey" :model="model" inverted />
    </MLayoutSider>
  </MLayout>
</template>
