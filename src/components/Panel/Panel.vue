<script setup lang="ts">
import type { PanelProps } from './types'
import { computed } from 'vue'
import { useWdId } from '../../shared/useWdId'
import { useWdLocale } from '../../locale'
import { resolveSizeClass } from '../../shared/types'
import { useControllable } from '../../shared/useControllable'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<PanelProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
  modelValue: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}>()

const locale = useWdLocale()
const contentId = useWdId()
const sizeTone = computed(() => resolveSizeClass(props.size))

function resolveControlledCollapsed() {
  if (props.collapsed !== undefined) return props.collapsed
  if (props.modelValue !== undefined) return props.modelValue
  return undefined
}

const { value: isCollapsed, setValue: setCollapsed } = useControllable(
  {
    controlled: resolveControlledCollapsed,
    defaultValue: props.defaultCollapsed,
  },
  (next) => {
    emit('update:collapsed', next)
    emit('update:modelValue', next)
  },
)

const rootClass = computed(() => [
  'wd-panel',
  {
    'wd-panel--collapsed': isCollapsed.value,
    'wd-panel--small': sizeTone.value === 'small',
    'wd-panel--large': sizeTone.value === 'large',
  },
])

function toggle() {
  if (!props.toggleable) return
  setCollapsed(!isCollapsed.value)
}
</script>

<template>
  <section :class="rootClass">
    <header v-if="$slots.header || header || toggleable" class="wd-panel__header">
      <div class="wd-panel__title">
        <slot name="header">
          {{ header }}
        </slot>
      </div>
      <button
        v-if="toggleable"
        type="button"
        class="wd-panel__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        :aria-label="isCollapsed ? locale.expand : locale.collapse"
        @click="toggle"
      >
        <WdIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
      </button>
    </header>
    <Transition name="wd-panel-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="wd-panel__content">
        <slot />
      </div>
    </Transition>
    <footer v-if="$slots.footer && !isCollapsed" class="wd-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
