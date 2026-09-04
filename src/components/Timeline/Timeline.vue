<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { TimelineEvent, TimelineProps, TimelineSeverity } from './types'
import { computed } from 'vue'
import { normalizeSeverity } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'
import { isIconName } from '../Icon/icons'

const props = withDefaults(defineProps<TimelineProps>(), {
  align: 'left',
  layout: 'vertical',
})

const pendingLabel = computed(() => {
  if (props.pending === true) return ''
  if (typeof props.pending === 'string') return props.pending
  return null
})

const events = computed(() => {
  if (pendingLabel.value == null) return props.value
  return [
    ...props.value,
    { content: pendingLabel.value, status: pendingLabel.value || undefined },
  ]
})

const rootClass = computed(() => [
  'wd-timeline',
  `wd-timeline--${props.layout}`,
  `wd-timeline--${props.align}`,
  { 'wd-timeline--pending': pendingLabel.value != null },
])

function side(index: number): 'left' | 'right' {
  if (props.align === 'right') return 'right'
  if (props.align === 'alternate') return index % 2 === 0 ? 'left' : 'right'
  return 'left'
}

function markerTone(severity?: TimelineSeverity) {
  if (!severity) return undefined
  if (severity === 'help') return 'help'
  return normalizeSeverity(severity) ?? undefined
}

function markerStyle(event: TimelineEvent) {
  if (event.color) return { background: event.color, borderColor: event.color, color: 'var(--wd-color-contrast-fg)' }
  return undefined
}

function markerClass(event: TimelineEvent) {
  const tone = markerTone(event.severity)
  return tone ? `wd-timeline__marker--${tone}` : undefined
}

function iconName(event: TimelineEvent): IconName | undefined {
  if (event.icon && isIconName(String(event.icon))) return event.icon as IconName
  return undefined
}

function isPending(index: number) {
  return pendingLabel.value != null && index === events.value.length - 1
}
</script>

<template>
  <ul :class="rootClass">
    <li
      v-for="(event, index) in events"
      :key="index"
      class="wd-timeline__event"
      :class="[`wd-timeline__event--${side(index)}`, { 'wd-timeline__event--pending': isPending(index) }]"
    >
      <slot name="item" :item="event" :index="index">
        <div class="wd-timeline__opposite">
          <slot name="opposite" :item="event" :index="index">
            {{ event.date }}
          </slot>
        </div>
        <div class="wd-timeline__separator">
          <slot name="marker" :item="event" :index="index">
            <span
              class="wd-timeline__marker"
              :class="markerClass(event)"
              :style="markerStyle(event)"
            >
              <WdIcon v-if="iconName(event)" :name="iconName(event)!" size="sm" />
              <span v-else-if="event.icon" aria-hidden="true">{{ event.icon }}</span>
            </span>
          </slot>
          <slot name="connector" :item="event" :index="index">
            <span class="wd-timeline__connector" />
          </slot>
        </div>
        <div class="wd-timeline__content">
          <slot name="content" :item="event" :index="index">
            <div v-if="event.status" class="wd-timeline__status">
              {{ event.status }}
            </div>
            <div>{{ event.content }}</div>
          </slot>
        </div>
      </slot>
    </li>
  </ul>
</template>
