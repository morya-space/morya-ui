<script setup lang="ts">
import {
  MButton,
  MDialog,
  MSelect,
  registerMotionPreset,
  unregisterMotionPreset,
} from 'morya-ui'
import { onMounted, onUnmounted, ref } from 'vue'
import 'animate.css'

/** Map public preset ids → Vue Transition CSS names (must match bridge styles below). */
const animatePresets = [
  { id: 'animate-bounce', name: 'm-animate-bounce' },
  { id: 'animate-zoom', name: 'm-animate-zoom' },
  { id: 'animate-fade-up', name: 'm-animate-fade-up' },
] as const

onMounted(() => {
  for (const preset of animatePresets) {
    registerMotionPreset(preset.id, { name: preset.name })
  }
})

onUnmounted(() => {
  for (const preset of animatePresets) {
    unregisterMotionPreset(preset.id)
  }
})

const presetIds = animatePresets.map(p => p.id)
const dialogPreset = ref<(typeof presetIds)[number]>('animate-bounce')
const popupPreset = ref<(typeof presetIds)[number]>('animate-fade-up')
const dialogOpen = ref(false)
const selectValue = ref<string | undefined>()

const selectOptions = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' },
  { label: '选项 C', value: 'c' },
]
</script>

<template>
  <div class="animate-css-lab">
    <p class="animate-css-lab__hint">
      文档站示例：通过 <code>registerMotionPreset</code> 把 Animate.css 挂到组件
      <code>transition</code>。切换后请重新打开。
    </p>
    <div class="animate-css-lab__row">
      <label>
        Dialog
        <select v-model="dialogPreset">
          <option v-for="id in presetIds" :key="id" :value="id">{{ id }}</option>
        </select>
      </label>
      <label>
        Select / popup
        <select v-model="popupPreset">
          <option v-for="id in presetIds" :key="id" :value="id">{{ id }}</option>
        </select>
      </label>
    </div>
    <div class="animate-css-lab__actions">
      <MButton label="打开 Dialog" size="small" @click="dialogOpen = true" />
      <MSelect
        v-model="selectValue"
        class="animate-css-lab__select"
        :options="selectOptions"
        :transition="popupPreset"
        placeholder="打开下拉"
        size="small"
      />
    </div>
    <MDialog
      v-model="dialogOpen"
      :transition="dialogPreset"
      title="Animate.css 预设"
      width="22rem"
    >
      <p style="margin:0;color:var(--m-color-text-muted)">当前：{{ dialogPreset }}</p>
    </MDialog>
  </div>
</template>

<style scoped>
.animate-css-lab {
  display: grid;
  gap: var(--m-space-3);
  padding: var(--m-space-3);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
}
.animate-css-lab__hint {
  margin: 0;
  font-size: var(--m-font-size-sm);
  color: var(--m-color-text-muted);
}
.animate-css-lab__hint code {
  font-family: var(--m-font-mono, ui-monospace, monospace);
  font-size: 0.9em;
}
.animate-css-lab__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-3);
}
.animate-css-lab__row label {
  display: grid;
  gap: 0.25rem;
  font-size: var(--m-font-size-sm);
  color: var(--m-color-text-muted);
}
.animate-css-lab__row select {
  font: inherit;
  color: var(--m-color-text);
  background: var(--m-color-surface);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-sm);
  padding: 0.25rem 0.5rem;
}
.animate-css-lab__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-2);
  align-items: center;
}
.animate-css-lab__select {
  width: 10rem;
}
</style>

<!--
  Global (unscoped): markdown-preview inlines this SFC next to the .md, so relative
  CSS imports break. Keep the bridge here; mirror lives in animate-css-bridge.css for copy-paste.
-->
<style>
.m-animate-bounce-enter-active {
  animation: bounceIn var(--m-motion-enter) both;
}
.m-animate-bounce-leave-active {
  animation: bounceOut var(--m-motion-exit) both;
}
.m-dialog-backdrop.m-animate-bounce-enter-active,
.m-drawer-backdrop.m-animate-bounce-enter-active {
  animation: fadeIn var(--m-motion-enter) both;
}
.m-dialog-backdrop.m-animate-bounce-leave-active,
.m-drawer-backdrop.m-animate-bounce-leave-active {
  animation: fadeOut var(--m-motion-exit) both;
}
.m-animate-bounce-enter-active .m-dialog-zoom,
.m-animate-bounce-enter-active .m-drawer {
  animation: bounceIn var(--m-motion-enter) both;
}
.m-animate-bounce-leave-active .m-dialog-zoom,
.m-animate-bounce-leave-active .m-drawer {
  animation: bounceOut var(--m-motion-exit) both;
}

.m-animate-zoom-enter-active {
  animation: zoomIn var(--m-motion-enter) both;
}
.m-animate-zoom-leave-active {
  animation: zoomOut var(--m-motion-exit) both;
}
.m-dialog-backdrop.m-animate-zoom-enter-active,
.m-drawer-backdrop.m-animate-zoom-enter-active {
  animation: fadeIn var(--m-motion-enter) both;
}
.m-dialog-backdrop.m-animate-zoom-leave-active,
.m-drawer-backdrop.m-animate-zoom-leave-active {
  animation: fadeOut var(--m-motion-exit) both;
}
.m-animate-zoom-enter-active .m-dialog-zoom,
.m-animate-zoom-enter-active .m-drawer {
  animation: zoomIn var(--m-motion-enter) both;
}
.m-animate-zoom-leave-active .m-dialog-zoom,
.m-animate-zoom-leave-active .m-drawer {
  animation: zoomOut var(--m-motion-exit) both;
}

.m-animate-fade-up-enter-active {
  animation: fadeInUp var(--m-motion-enter) both;
}
.m-animate-fade-up-leave-active {
  animation: fadeOutDown var(--m-motion-exit) both;
}
.m-dialog-backdrop.m-animate-fade-up-enter-active,
.m-drawer-backdrop.m-animate-fade-up-enter-active {
  animation: fadeIn var(--m-motion-enter) both;
}
.m-dialog-backdrop.m-animate-fade-up-leave-active,
.m-drawer-backdrop.m-animate-fade-up-leave-active {
  animation: fadeOut var(--m-motion-exit) both;
}
.m-animate-fade-up-enter-active .m-dialog-zoom,
.m-animate-fade-up-enter-active .m-drawer {
  animation: fadeInUp var(--m-motion-enter) both;
}
.m-animate-fade-up-leave-active .m-dialog-zoom,
.m-animate-fade-up-leave-active .m-drawer {
  animation: fadeOutDown var(--m-motion-exit) both;
}
</style>
