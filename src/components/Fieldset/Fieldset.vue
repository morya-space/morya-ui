<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { FieldsetProps } from './types'
import { useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useControllable } from '../../shared/useControllable'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const contentId = useMId()

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
  <fieldset v-bind="rootAttrs" class="m-fieldset" :class="{ 'm-fieldset--collapsed': isCollapsed }">
    <legend v-if="$slots.legend || legend || toggleable" class="m-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="m-fieldset__toggler"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <MIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
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
    <Transition name="m-fieldset-collapse">
      <div v-show="!isCollapsed" :id="contentId" class="m-fieldset__content">
        <slot />
      </div>
    </Transition>
  </fieldset>
</template>
