<script setup lang="ts">
import type { FieldsetProps } from './types'
import { useRdId } from '../../shared/useRdId'
import { useControllable } from '../../shared/useControllable'
import RdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const contentId = useRdId()

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
  <fieldset class="rd-fieldset" :class="{ 'rd-fieldset--collapsed': isCollapsed }">
    <legend v-if="$slots.legend || legend || toggleable" class="rd-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="rd-fieldset__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <RdIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
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
    <Transition name="rd-fieldset-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="rd-fieldset__content">
        <slot />
      </div>
    </Transition>
  </fieldset>
</template>
