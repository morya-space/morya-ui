<script setup lang="ts">
import type { IconCategoryId, ToastMessage } from 'morya-ui'
import {
  getIconCategory,
  getIconCategoryGroups,
  iconCategoryMeta,
  iconNames,
  MIcon,
  MInput,
  MToast,
} from 'morya-ui'
import { computed, ref } from 'vue'

const query = ref('')
const category = ref<IconCategoryId | 'all'>('all')
const copied = ref<string | null>(null)
const messages = ref<ToastMessage[]>([])
let toastSeq = 0
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const categoryOptions = computed(() => [
  { id: 'all' as const, label: 'All' },
  ...iconCategoryMeta.map((item) => ({ id: item.id, label: item.labelEn })),
])

const filteredNames = computed(() => {
  const q = query.value.trim().toLowerCase()
  return iconNames.filter((name) => {
    if (q && !name.toLowerCase().includes(q)) return false
    if (category.value !== 'all') return getIconCategory(name) === category.value
    return true
  })
})

const grouped = computed(() => getIconCategoryGroups(filteredNames.value))

function chipStyle(id: IconCategoryId | 'all') {
  const active = category.value === id
  return [
    `background:${active ? 'var(--m-color-primary-soft, color-mix(in srgb, var(--m-color-primary) 14%, transparent))' : 'var(--m-color-surface)'}`,
    `border:1px solid ${active ? 'var(--m-color-primary)' : 'var(--m-color-border)'}`,
    'border-radius:var(--m-radius-full, 999px)',
    `color:${active ? 'var(--m-color-primary)' : 'var(--m-color-text)'}`,
    'cursor:pointer',
    'font:inherit',
    'font-size:0.8125rem',
    'line-height:1.2',
    'padding:0.35rem 0.75rem',
  ].join(';')
}

function itemStyle(name: string) {
  const active = copied.value === name
  return [
    'align-items:center',
    'background:var(--m-color-surface)',
    `border:1px solid ${active ? 'var(--m-color-primary)' : 'var(--m-color-border)'}`,
    'border-radius:var(--m-radius-control, 3px)',
    `color:${active ? 'var(--m-color-primary)' : 'var(--m-color-text)'}`,
    'cursor:pointer',
    'display:flex',
    'flex-direction:column',
    'font:inherit',
    'gap:0.65rem',
    'justify-content:center',
    'min-height:6.5rem',
    'padding:0.85rem 0.5rem',
    'width:100%',
  ].join(';')
}

async function copyName(name: string) {
  try {
    await navigator.clipboard.writeText(name)
  } catch {
    const area = document.createElement('textarea')
    area.value = name
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  copied.value = name
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    if (copied.value === name) copied.value = null
  }, 1200)

  const id = `icon-copy-${++toastSeq}`
  messages.value = [
    ...messages.value,
    {
      id,
      severity: 'success',
      summary: 'Copied',
      detail: name,
      closable: true,
    },
  ]
  window.setTimeout(() => {
    messages.value = messages.value.filter((item) => item.id !== id)
  }, 1600)
}

function onToastClose(message: ToastMessage) {
  messages.value = messages.value.filter((item) => item.id !== message.id)
}
</script>

<template>
  <div class="w-full">
    <MInput
      v-model="query"
      clearable
      fluid
      placeholder="Search icon names…"
      class="max-w-xs mb-3"
    >
      <template #prefix>
        <MIcon name="search" size="sm" />
      </template>
    </MInput>

    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem">
      <button
        v-for="opt in categoryOptions"
        :key="opt.id"
        type="button"
        :style="chipStyle(opt.id)"
        @click="category = opt.id"
      >
        {{ opt.label }}
      </button>
    </div>

    <p
      v-if="!grouped.length"
      style="color: var(--m-color-text-muted); font-size: 0.875rem; margin: 0.5rem 0 0"
    >
      No matching icons
    </p>

    <div v-else style="display:grid;gap:1.25rem;width:100%">
      <section v-for="group in grouped" :key="group.id">
        <h4
          style="align-items:baseline;color:var(--m-color-text);display:flex;font-size:0.875rem;font-weight:600;gap:0.5rem;margin:0 0 0.65rem"
        >
          <span>{{ group.labelEn }}</span>
          <span style="color:var(--m-color-text-muted);font-size:0.75rem;font-weight:500">
            {{ group.icons.length }}
          </span>
        </h4>
        <div
          style="display:grid;grid-template-columns:repeat(auto-fill,minmax(7.25rem,1fr));gap:0.75rem;width:100%"
        >
          <button
            v-for="name in group.icons"
            :key="name"
            type="button"
            :style="itemStyle(name)"
            :title="`Click to copy ${name}`"
            @click="copyName(name)"
          >
            <MIcon :name="name" size="large" />
            <span
              style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.72rem;line-height:1.3;max-width:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap"
            >
              {{ copied === name ? 'Copied' : name }}
            </span>
          </button>
        </div>
      </section>
    </div>

    <MToast :messages="messages" position="top-right" @close="onToastClose" />
  </div>
</template>
