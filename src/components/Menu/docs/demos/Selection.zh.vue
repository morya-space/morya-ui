<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  { key: 'users', label: '用户', icon: 'users' },
  { key: 'settings', label: '设置', icon: 'settings', disabled: true },
]
</script>

<template>
  <div>
    <MMenu
      v-model:selected-key="selectedKey"
      :model="model"
      embedded
      @select="(item) => console.log('select', item.key)"
    />
  </div>
</template>
