<script setup lang="ts">
import type { FieldsetProps } from './types'
import { computed } from 'vue'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<FieldsetProps>(), {
  toggleable: false,
  collapsed: false,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
}>()

const isCollapsed = computed(() => props.collapsed)

function toggle() {
  if (!props.toggleable) return
  emit('update:collapsed', !isCollapsed.value)
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
    <div v-show="!isCollapsed" class="wi-fieldset__content">
      <slot />
    </div>
  </fieldset>
</template>
