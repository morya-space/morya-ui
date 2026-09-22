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

const sharedPresets = [
  'fade',
  'scale-fade',
  'slide-fade',
  'zoom',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
] as const

const dialogPresets = ['dialog', ...sharedPresets] as const
const drawerPresets = ['drawer', ...sharedPresets] as const

const dialogPreset = ref<(typeof dialogPresets)[number]>('dialog')
const popupPreset = ref<(typeof sharedPresets)[number]>('scale-fade')
const drawerPreset = ref<(typeof drawerPresets)[number]>('drawer')
const toastPreset = ref<(typeof sharedPresets)[number]>('slide-fade')

const dialogOpen = ref(false)
const drawerOpen = ref(false)
const selectValue = ref<string | undefined>()

/** Also publish via ConfigProvider so global `motion.transitions` path is exercised. */
const motion = computed(() => ({
  transitions: {
    dialog: dialogPreset.value,
    popup: popupPreset.value,
    drawer: drawerPreset.value,
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
    <MToast :transition="toastPreset" />
    <div class="motion-preset-lab">
      <p class="motion-preset-lab__hint">
        切换预设后重新打开组件；Dialog 推荐先对比 <code>dialog</code> 与 <code>slide-up</code>。
      </p>
      <div class="motion-preset-lab__row">
        <label>
          Dialog
          <select v-model="dialogPreset">
            <option v-for="id in dialogPresets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Select / popup
          <select v-model="popupPreset">
            <option v-for="id in sharedPresets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Drawer
          <select v-model="drawerPreset">
            <option v-for="id in drawerPresets" :key="id" :value="id">{{ id }}</option>
          </select>
        </label>
        <label>
          Toast
          <select v-model="toastPreset">
            <option v-for="id in sharedPresets" :key="id" :value="id">{{ id }}</option>
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
          :transition="popupPreset"
          placeholder="打开下拉"
          size="small"
        />
      </div>

      <MDialog
        v-model="dialogOpen"
        :transition="dialogPreset"
        title="Dialog 预设"
        width="22rem"
      >
        <p style="margin:0;color:var(--m-color-text-muted)">当前：{{ dialogPreset }}</p>
      </MDialog>
      <MDrawer
        v-model="drawerOpen"
        :transition="drawerPreset"
        header="Drawer 预设"
        position="right"
      >
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
.motion-preset-lab__hint {
  margin: 0;
  font-size: var(--m-font-size-sm);
  color: var(--m-color-text-muted);
}
.motion-preset-lab__hint code {
  font-family: var(--m-font-mono, ui-monospace, monospace);
  font-size: 0.9em;
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
