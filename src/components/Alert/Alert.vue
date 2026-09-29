<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { AlertProps, AlertSeverity } from './types'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { resolveIconSizeFromClass } from '../../shared/types'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AlertProps>(), {
  severity: 'info',
  showIcon: true,
  closable: false,
  banner: false,
})

const emit = defineEmits<{ close: [] }>()
const attrs = useAttrs()
const slots = useSlots()
const locale = useMLocale()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const sizeClass = useConfiguredSize('Alert', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const closed = ref(false)

const SEVERITY_ICON: Record<AlertSeverity, IconName> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'warning',
  error: 'x-circle',
}

const toneClass = computed(() => {
  if (props.severity === 'error') return 'error'
  if (props.severity === 'warning') return 'warning'
  return props.severity
})

const statusRole = computed(() =>
  props.severity === 'error' || props.severity === 'warning' ? 'alert' : 'status',
)

const showTitle = computed(() => Boolean(slots.title || props.title))
const showDescription = computed(() =>
  Boolean(slots.default || props.description),
)

const rootClass = computed(() => [
  'm-alert',
  `m-alert--${toneClass.value}`,
  `m-alert--${sizeClass.value}`,
  {
    'm-alert--banner': props.banner,
    'm-alert--closable': props.closable,
    'm-alert--with-icon': props.showIcon,
    'm-alert--with-title': showTitle.value,
  },
])

function onClose() {
  closed.value = true
  emit('close')
}
</script>

<template>
  <div
    v-if="!closed"
    v-bind="rootAttrs"
    :class="rootClass"
    :role="statusRole"
  >
    <span
      v-if="showIcon"
      class="m-alert__icon"
      aria-hidden="true"
    >
      <slot name="icon">
        <MIcon
          :name="SEVERITY_ICON[severity]"
          :size="iconSize"
        />
      </slot>
    </span>

    <div class="m-alert__body">
      <div
        v-if="showTitle"
        class="m-alert__title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="showDescription"
        class="m-alert__description"
      >
        <slot>
          {{ description }}
        </slot>
      </div>
    </div>

    <div
      v-if="slots.action"
      class="m-alert__action"
    >
      <slot name="action" />
    </div>

    <button
      v-if="closable"
      type="button"
      class="m-alert__close"
      :aria-label="locale.close"
      @click="onClose"
    >
      <MIcon
        name="close"
        :size="iconSize"
      />
    </button>
  </div>
</template>
