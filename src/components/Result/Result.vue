<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { ResultProps, ResultStatus } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()

type ResultTone = 'success' | 'info' | 'warn' | 'error' | '403' | '404' | '500'

function normalizeStatus(status: ResultStatus): ResultTone {
  if (status === 'warning' || status === 'warn') return 'warn'
  if (status === 'danger' || status === 'error') return 'error'
  return status
}

const tone = computed(() => normalizeStatus(props.status))

const statusIcon = computed<IconName>(() => {
  if (props.icon) return props.icon
  switch (tone.value) {
    case 'success':
      return 'check-circle'
    case 'warn':
      return 'warning'
    case 'error':
    case '500':
      return 'x-circle'
    case '403':
      return 'lock'
    case '404':
      return 'search'
    default:
      return 'info'
  }
})

const resolvedTitle = computed(() => {
  if (props.title != null) return props.title
  const messages = locale.value
  switch (tone.value) {
    case 'success':
      return messages.resultSuccess
    case 'warn':
      return messages.resultWarning
    case 'error':
      return messages.resultError
    case '403':
      return messages.result403
    case '404':
      return messages.result404
    case '500':
      return messages.result500
    default:
      return messages.resultInfo
  }
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-result"
    :class="`m-result--${tone}`"
    role="status"
  >
    <div class="m-result__icon" aria-hidden="true">
      <slot name="icon">
        <MIcon
          class="m-result__glyph"
          :name="statusIcon"
          size="lg"
        />
      </slot>
    </div>

    <div
      v-if="slots.title || resolvedTitle"
      class="m-result__title"
    >
      <slot name="title">{{ resolvedTitle }}</slot>
    </div>

    <div
      v-if="slots.description || description"
      class="m-result__description"
    >
      <slot name="description">{{ description }}</slot>
    </div>

    <div
      v-if="slots.extra || slots.default"
      class="m-result__extra"
    >
      <slot name="extra" />
      <slot />
    </div>
  </div>
</template>
