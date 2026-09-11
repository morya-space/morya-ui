<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { PanelProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'
import { useMId } from '../../shared/useMId'
import { useMLocale } from '../../locale'
import { resolveSizeClass } from '../../shared/types'
import { useControllable } from '../../shared/useControllable'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<PanelProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
  modelValue: undefined,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}>()

const locale = useMLocale()
const contentId = useMId()
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
  'm-panel',
  {
    'm-panel--collapsed': isCollapsed.value,
    'm-panel--small': sizeTone.value === 'small',
    'm-panel--large': sizeTone.value === 'large',
  },
])

function toggle() {
  if (!props.toggleable) return
  setCollapsed(!isCollapsed.value)
}
</script>

<template>
  <section v-bind="rootAttrs" :class="rootClass">
    <header v-if="$slots.header || header || toggleable" class="m-panel__header">
      <div class="m-panel__title">
        <slot name="header">
          {{ header }}
        </slot>
      </div>
      <button
        v-if="toggleable"
        type="button"
        class="m-panel__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        :aria-label="isCollapsed ? locale.expand : locale.collapse"
        @click="toggle"
      >
        <MIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
      </button>
    </header>
    <Transition name="m-panel-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="m-panel__content">
        <slot />
      </div>
    </Transition>
    <footer v-if="$slots.footer && !isCollapsed" class="m-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
