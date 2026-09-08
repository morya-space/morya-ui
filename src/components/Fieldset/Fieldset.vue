<script setup lang="ts">
import type { FieldsetProps } from './types'
import { useWkId } from '../../shared/useWkId'
import { useControllable } from '../../shared/useControllable'
import WkIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const contentId = useWkId()

const { value: isCollapsed, setValue: setCollapsed } = useControllable(
  {
    controlled: () => props.collapsed,
    defaultValue: props.defaultCollapsed,
  },
  (next) => emit('update:collapsed', next),
)

function toggle() {
  if (!props.toggleable) return
  setCollapsed(!isCollapsed.value)
}
</script>

<template>
  <fieldset class="wk-fieldset" :class="{ 'wk-fieldset--collapsed': isCollapsed }">
    <legend v-if="$slots.legend || legend || toggleable" class="wk-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="wk-fieldset__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <WkIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
        <slot name="legend">
          {{ legend }}
        </slot>
      </button>
      <template v-else>
        <slot name="legend">
          {{ legend }}
        </slot>
      </template>
    </legend>
    <Transition name="wk-fieldset-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="wk-fieldset__content">
        <slot />
      </div>
    </Transition>
  </fieldset>
</template>
