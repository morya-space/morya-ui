<script setup lang="ts">
import type { FieldsetProps } from './types'
import { useId } from 'vue'
import { useControllable } from '../../shared/useControllable'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const contentId = useId()

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
  <fieldset class="wi-fieldset" :class="{ 'wi-fieldset--collapsed': isCollapsed }">
    <legend v-if="$slots.legend || legend || toggleable" class="wi-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="wi-fieldset__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <WiIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
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
    <div :id="contentId" v-show="!isCollapsed" class="wi-fieldset__content">
      <slot />
    </div>
  </fieldset>
</template>
