<script setup lang="ts">
import type { FieldsetProps } from './types'
import { useWdId } from '../../shared/useWdId'
import { useControllable } from '../../shared/useControllable'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const contentId = useWdId()

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
  <fieldset class="wd-fieldset" :class="{ 'wd-fieldset--collapsed': isCollapsed }">
    <legend v-if="$slots.legend || legend || toggleable" class="wd-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="wd-fieldset__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <WdIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
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
    <Transition name="wd-fieldset-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="wd-fieldset__content">
        <slot />
      </div>
    </Transition>
  </fieldset>
</template>
