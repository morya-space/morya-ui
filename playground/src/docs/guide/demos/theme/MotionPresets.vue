<script setup lang="ts">
import {
  MButton,
  MConfigProvider,
  MDialog,
  MDrawer,
  MSelect,
  MToast,
  toast,
} from 'morya-ui'
import { computed, ref } from 'vue'

const presets = [
  'fade',
  'scale-fade',
  'slide-fade',
  'zoom',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
] as const

const dialogPreset = ref<(typeof presets)[number]>('zoom')
const popupPreset = ref<(typeof presets)[number]>('scale-fade')
const drawerPreset = ref<(typeof presets)[number]>('drawer')
const toastPreset = ref<(typeof presets)[number]>('slide-fade')

const dialogOpen = ref(false)
const drawerOpen = ref(false)
const selectValue = ref<string | undefined>()

const motion = computed(() => ({
  transitions: {
    dialog: dialogPreset.value,
    popup: popupPreset.value,
    drawer: drawerPreset.value === 'drawer' ? 'drawer' : drawerPreset.value,
    toast: toastPreset.value,
  },
}))

const selectOptions = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' },
  { label: '选项 C', value: 'c' },
]

function showToast() {
  toast.info({ summary: '动效预设', detail: `当前 toast：${toastPreset.value}`, life: 2500 })
}
</script>

<template>
  <MConfigProvider :motion="motion" :respect-reduced-motion="false" :global-density="false">
    <MToast />
    <div class="motion-preset-lab">
      <div class="motion-preset-lab__row">
        <label>
          Dialog
          <select v-model="dialogPreset">
            <option v-for="id in presets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Select / popup
          <select v-model="popupPreset">
            <option v-for="id in presets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Drawer
          <select v-model="drawerPreset">
            <option value="drawer">drawer</option>
            <option v-for="id in presets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Toast
          <select v-model="toastPreset">
            <option v-for="id in presets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
      </div>

      <div class="motion-preset-lab__actions">
        <MButton label="打开 Dialog" size="small" @click="dialogOpen = true" />
        <MButton label="打开 Drawer" size="small" outlined @click="drawerOpen = true" />
        <MButton label="弹出 Toast" size="small" text @click="showToast" />
        <MSelect
          v-model="selectValue"
          class="motion-preset-lab__select"
          :options="selectOptions"
          placeholder="打开下拉"
          size="small"
        />
      </div>

      <MDialog v-model="dialogOpen" title="Dialog 预设" width="22rem">
        <p style="margin:0;color:var(--m-color-text-muted)">当前：{{ dialogPreset }}</p>
      </MDialog>
      <MDrawer v-model="drawerOpen" header="Drawer 预设" position="right">
        <p style="margin:0;color:var(--m-color-text-muted)">当前：{{ drawerPreset }}</p>
      </MDrawer>
    </div>
  </MConfigProvider>
</template>

<style scoped>
.motion-preset-lab {
  display: grid;
  gap: var(--m-space-3);
  padding: var(--m-space-3);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
}
.motion-preset-lab__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-3);
}
.motion-preset-lab__row label {
  display: grid;
  gap: 0.25rem;
  font-size: var(--m-font-size-sm);
  color: var(--m-color-text-muted);
}
.motion-preset-lab__row select {
  font: inherit;
  color: var(--m-color-text);
  background: var(--m-color-surface);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-sm);
  padding: 0.25rem 0.5rem;
}
.motion-preset-lab__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-2);
  align-items: center;
}
.motion-preset-lab__select {
  width: 10rem;
}
</style>
