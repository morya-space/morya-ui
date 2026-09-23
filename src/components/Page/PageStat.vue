<script setup lang="ts">
import type { IconName } from '../Icon/icons'
import type { PageStatProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import MCard from '../Card/Card.vue'
import MIcon from '../Icon/Icon.vue'
import MSkeleton from '../Skeleton/Skeleton.vue'

defineOptions({ name: 'MPageStat', inheritAttrs: false })

const props = withDefaults(defineProps<PageStatProps>(), {
  trendSeverity: 'primary',
  shadow: 'always',
  layout: 'card',
  density: 'default',
  orientation: 'stacked',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const statClass = computed(() => [
  'm-page-stat',
  {
    'm-page-stat--plain': props.layout === 'plain',
    'm-page-stat--compact': props.density === 'compact',
    'm-page-stat--inline': props.orientation === 'inline',
  },
])

const surface = computed(() => (props.layout === 'card' ? MCard : 'div'))

const surfaceProps = computed(() => {
  const base = {
    ...rootAttrs.value,
    class: statClass.value,
    'aria-label': props.label,
  }
  if (props.layout === 'card') {
    return { ...base, shadow: props.shadow }
  }
  return base
})

const trendClass = computed(() => [
  'm-page-stat__trend',
  `m-page-stat__trend--${props.trendSeverity}`,
])

const trendIcon = computed<IconName | undefined>(() => {
  if (props.trendDirection === 'up') return 'arrow-narrow-up'
  if (props.trendDirection === 'down') return 'arrow-narrow-down'
  return undefined
})

const hasMeta = computed(() => Boolean(props.trend || props.trendLabel))
</script>

<template>
  <component :is="surface" v-bind="surfaceProps">
    <div class="m-page-stat__body">
      <div class="m-page-stat__content">
        <p v-if="label" class="m-page-stat__label">
          {{ label }}
        </p>
        <template v-if="loading">
          <MSkeleton width="7rem" height="1.75rem" />
          <MSkeleton v-if="hasMeta" text width="4.5rem" />
        </template>
        <template v-else>
          <p v-if="value != null && value !== ''" class="m-page-stat__value">
            {{ value }}
          </p>
          <div v-if="hasMeta" class="m-page-stat__meta">
            <span v-if="trend" :class="trendClass">
              <MIcon
                v-if="trendIcon"
                :name="trendIcon"
                class="m-page-stat__trend-icon"
                aria-hidden="true"
              />
              {{ trend }}
            </span>
            <span v-if="trendLabel" class="m-page-stat__trend-label">
              {{ trendLabel }}
            </span>
          </div>
          <slot />
        </template>
      </div>
      <span v-if="icon" class="m-page-stat__icon">
        <MIcon
          :name="icon"
          aria-hidden="true"
        />
      </span>
    </div>
  </component>
</template>
