<script setup lang="ts">
import type {MenuItem} from 'morya-ui';
import type {Component} from 'vue';
import  { MCard, MFlex, MMenu   } from 'morya-ui';

import {  computed, defineAsyncComponent, h, ref } from 'vue';


const components = import.meta.glob('./components/*.vue');
const componentsList = Object.keys(components).map(key => {
  return {
    label: key.split('/').pop()?.replace('.vue', ''),
    key: key.split('/').pop()?.replace('.vue', ''),
    component: components[key]
  }
});

const componentMap = new Map<string, Component>();
componentsList.forEach(item => {
  componentMap.set(item.key!, item.component!);
});

const selectedKey = ref<string | null>('MButton');

const showCurrentComponent = computed(() => {
  const comp = componentMap.get(selectedKey.value!)!
  return comp ? defineAsyncComponent(comp as any) :  (h('span', '暂无组件') as Component);
});
</script>

<template>
  <MFlex class="components-shell-list-container">
    <div class="list-menu-container">
      <MMenu v-model:selected-key="selectedKey" :model="componentsList" />
    </div>
    <div class="component-container">
      <Suspense>
        <component :is="showCurrentComponent" />
      </Suspense>
    </div>
  </MFlex>
</template>

<style scoped>
.components-shell-list-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.list-menu-container {
  width: 200px;
  height: 100%;
  padding: 8px 0;
  border-right: 1px solid var(--m-color-border);
}

.component-container {
  flex: 1;
  height: 100%;
  padding: 8px;
}

</style>
