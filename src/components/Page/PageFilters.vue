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
const showTrailing = computed(() => Boolean(slots.actions) || showCollapsible.value)

const expandText = computed(() => props.expandLabel ?? locale.value.advancedFilters ?? '高级筛选')
const collapseText = computed(() => props.collapseLabel ?? locale.value.collapseFilters ?? '收起')
const toggleIcon = computed(() => (props.expanded ? 'chevron-up' : 'chevron-down'))
const toggleLabel = computed(() => (props.expanded ? collapseText.value : expandText.value))

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
      <div
        v-if="showTrailing"
        class="m-page-filters__trailing"
      >
        <div
          v-if="$slots.actions"
          class="m-page-filters__actions"
        >
          <slot name="actions" />
        </div>
        <MButton
          v-if="showCollapsible"
          type="button"
          severity="secondary"
          text
          class="m-page-filters__toggle"
          :icon="toggleIcon"
          icon-pos="right"
          :label="toggleLabel"
          :aria-expanded="expanded"
          :aria-controls="advancedId"
          @click="toggleExpanded"
        />
      </div>
    </div>
    <div
      v-if="showCollapsible && expanded"
      :id="advancedId"
      class="m-page-filters__advanced"
    >
      <slot name="advanced" />
    </div>
    <div
      v-if="$slots.active"
      class="m-page-filters__active"
    >
      <slot name="active" />
    </div>
  </section>
</template>
