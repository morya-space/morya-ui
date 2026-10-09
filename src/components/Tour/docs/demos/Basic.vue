<script setup lang="ts">
import type { TourStep } from '../../types'
import { computed, ref } from 'vue'
import { MButton, MSpace, MTour } from 'morya-ui'

const open = ref(false)
const current = ref(0)
const firstEl = ref<HTMLElement | null>(null)
const secondEl = ref<HTMLElement | null>(null)

function resolveEl(el: HTMLElement | { $el?: HTMLElement } | null) {
  if (!el) return null
  if (el instanceof HTMLElement) return el
  return el.$el ?? null
}

const steps = computed((): TourStep[] => [
  {
    title: 'Primary action',
    description: 'This button starts the guided tour.',
    target: () => resolveEl(firstEl.value),
  },
  {
    title: 'Secondary',
    description: 'You can attach steps to any element.',
    target: () => resolveEl(secondEl.value),
    placement: 'bottom-start',
  },
])
</script>

<template>
  <MSpace vertical>
    <MSpace>
      <span ref="firstEl">
        <MButton @click="open = true" type="primary">
          Start tour
        </MButton>
      </span>
      <span ref="secondEl">
        <MButton>
          Another control
        </MButton>
      </span>
    </MSpace>

    <MTour
      v-model:open="open"
      v-model:current="current"
      :steps="steps"
    />
  </MSpace>
</template>
