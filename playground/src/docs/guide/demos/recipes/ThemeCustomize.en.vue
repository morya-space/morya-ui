<script setup lang="ts">
import {
  createTheme,
  MButton,
  MConfigProvider,
  MInput,
  useTheme,
} from 'morya-ui'
import { onBeforeUnmount, ref, watch } from 'vue'

const PRIMARY_PROPS = [
  '--m-color-primary',
  '--m-color-primary-hover',
  '--m-color-primary-active',
  '--m-color-primary-bg',
  '--m-color-focus-ring',
] as const

const { isDark, setTheme } = useTheme()
const density = ref<'compact' | 'comfortable' | 'spacious'>('comfortable')
const primary = ref('#1677ff')
const previewEl = ref<HTMLElement | null>(null)

const presets = [
  { label: 'Blue', value: '#1677ff' },
  { label: 'Green', value: '#0b6e4f' },
  { label: 'Violet', value: '#7c3aed' },
]

function applyPrimary(el: HTMLElement | null, color: string) {
  if (!el) return
  const vars = createTheme({ seed: { colorPrimary: color } }).cssVars
  for (const prop of PRIMARY_PROPS) {
    const value = vars[prop]
    if (value) el.style.setProperty(prop, value)
    else el.style.removeProperty(prop)
  }
}

function clearPrimary(el: HTMLElement | null) {
  if (!el) return
  for (const prop of PRIMARY_PROPS) el.style.removeProperty(prop)
}

watch(
  [previewEl, primary],
  ([el, color]) => applyPrimary(el, color),
  { immediate: true },
)

onBeforeUnmount(() => {
  clearPrimary(previewEl.value)
})
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
      <MButton size="small" :type="isDark ? 'default' : 'primary'" label="Light" @click="setTheme('light')" />
      <MButton size="small" :type="isDark ? 'primary' : 'default'" label="Dark" @click="setTheme('dark')" />
      <span style="width:1px;height:1.25rem;background:var(--m-color-border)" />
      <MButton v-for="item in (['compact', 'comfortable', 'spacious'] as const)" :key="item" size="small" :type="density === item ? 'primary' : 'default'" :label="item" @click="density = item" />
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
      <MButton v-for="preset in presets" :key="preset.value" size="small" :type="primary === preset.value ? 'primary' : 'default'" :label="preset.label" @click="primary = preset.value" />
      <code style="font-size:0.75rem;color:var(--m-color-text-muted)">{{ primary }}</code>
    </div>

    <div
      ref="previewEl"
      style="padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);background:var(--m-color-surface)"
    >
      <MConfigProvider :density="density" :global-density="false">
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
          <MButton type="primary" label="Primary" />
          <MButton label="Outlined"/>
          <MInput placeholder="Preview input" class="w-48" />
        </div>
      </MConfigProvider>
      <p style="margin:0.75rem 0 0;color:var(--m-color-text-muted);font-size:0.75rem">
        Light/dark uses global <code>useTheme</code>; density is scoped to the preview; primary only writes brand CSS vars and clears them on unmount.
      </p>
    </div>
  </div>
</template>
