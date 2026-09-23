<script setup lang="ts">
import type { PageFiltersProps } from './types'
import { computed, useAttrs, useId, useSlots } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MButton from '../Button/Button.vue'

defineOptions({ name: 'MPageFilters', inheritAttrs: false })

const props = withDefaults(defineProps<PageFiltersProps>(), {
  variant: 'plain',
  collapsible: false,
  expanded: false,
})

const emit = defineEmits<{ (event: 'update:expanded', value: boolean): void }>()

const slots = useSlots()
const locale = useMLocale()
const advancedId = useId()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const hasAdvanced = computed(() => Boolean(slots.advanced))
const showCollapsible = computed(() => props.collapsible && hasAdvanced.value)

const expandText = computed(
  () => props.expandLabel ?? `${locale.expand ?? 'Expand'} ${locale.filterOptions ?? 'filters'}`,
)
const collapseText = computed(() => props.collapseLabel ?? locale.collapse)

const rootClass = computed(() => [
  'm-page-filters',
  {
    'm-page-filters--filled': props.variant === 'filled',
    'm-page-filters--collapsible': showCollapsible.value,
  },
])

function toggleExpanded() {
  emit('update:expanded', !props.expanded)
}
</script>

<template>
  <section
    v-bind="rootAttrs"
    :class="rootClass"
    :aria-label="ariaLabel"
  >
    <div class="m-page-filters__row">
      <div class="m-page-filters__controls">
        <slot />
      </div>
      <MButton
        v-if="showCollapsible"
        type="button"
        severity="secondary"
        text
        class="m-page-filters__toggle"
        :aria-expanded="expanded"
        :aria-controls="advancedId"
        @click="toggleExpanded"
      >
        {{ expanded ? collapseText : expandText }}
      </MButton>
    </div>
    <div
      v-if="showCollapsible && expanded"
      :id="advancedId"
      class="m-page-filters__advanced"
    >
      <slot name="advanced" />
    </div>
    <div v-if="$slots.active" class="m-page-filters__active">
      <slot name="active" />
    </div>
  </section>
</template>
