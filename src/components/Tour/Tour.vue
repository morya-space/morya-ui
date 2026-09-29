<script setup lang="ts">
import type { TourProps, TourStep } from './types'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useMLocale } from '../../locale'
import { useMConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useRootParts } from '../../shared/useComponentAttrs'
import MButton from '../Button/Button.vue'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TourProps>(), {
  steps: () => [],
  open: undefined,
  modelValue: undefined,
  current: 0,
  placement: 'bottom',
  mask: true,
  gap: 4,
  type: 'default',
  teleport: true,
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  'update:modelValue': [open: boolean]
  'update:current': [index: number]
  close: []
  finish: []
  change: [current: number]
}>()

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()
const config = useMConfig()

const panelRef = ref<HTMLElement | null>(null)
const spotlightStyle = ref<Record<string, string>>({})
const panelStyle = ref<Record<string, string>>({})

const isOpen = computed({
  get: () => props.open ?? props.modelValue ?? false,
  set: (value: boolean) => {
    emit('update:open', value)
    emit('update:modelValue', value)
  },
})

const stepIndex = computed({
  get: () => props.current ?? 0,
  set: (value: number) => {
    emit('update:current', value)
    emit('change', value)
  },
})

const totalSteps = computed(() => props.steps?.length ?? 0)
const currentStep = computed((): TourStep | undefined => props.steps?.[stepIndex.value])

const panelType = computed(() => currentStep.value?.type ?? props.type ?? 'default')

const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

const overlayZ = computed(() => props.zIndex ?? config.value.zIndex ?? 1000)

const labels = computed(() => ({
  prev: locale.value.tourPrev,
  next: locale.value.tourNext,
  finish: locale.value.tourFinish,
}))

function setOpen(open: boolean) {
  isOpen.value = open
  if (!open) emit('close')
}

function resolveTargetRect(): DOMRect | null {
  const target = currentStep.value?.target?.()
  if (!target) return null
  return target.getBoundingClientRect()
}

function updateGeometry() {
  const rect = resolveTargetRect()
  if (rect) {
    const pad = Math.max(0, props.gap ?? 4)
    spotlightStyle.value = {
      top: `${rect.top - pad}px`,
      left: `${rect.left - pad}px`,
      width: `${rect.width + pad * 2}px`,
      height: `${rect.height + pad * 2}px`,
    }
    const placement = currentStep.value?.placement ?? props.placement
    panelStyle.value = computeFloatingOverlayStyle(rect, placement, {
      gap: 12,
      zIndex: overlayZ.value + 1,
    })
  } else {
    spotlightStyle.value = {
      top: '50%',
      left: '50%',
      width: '0px',
      height: '0px',
      transform: 'translate(-50%, -50%)',
    }
    panelStyle.value = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: String(overlayZ.value + 1),
    }
  }
}

let raf = 0
function scheduleLayout() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    void nextTick(updateGeometry)
  })
}

function onScrollOrResize() {
  if (!isOpen.value) return
  scheduleLayout()
}

function onTourKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
    return
  }
  if (event.key === 'ArrowLeft' && stepIndex.value > 0) {
    event.preventDefault()
    goPrev()
  }
}

watch(isOpen, (open) => {
  if (open) {
    scheduleLayout()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('keydown', onTourKeydown)
  } else {
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
    document.removeEventListener('keydown', onTourKeydown)
  }
}, { immediate: true })

watch(stepIndex, () => {
  if (isOpen.value) scheduleLayout()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  document.removeEventListener('keydown', onTourKeydown)
  cancelAnimationFrame(raf)
})

function goPrev() {
  const prevProps = currentStep.value?.prevButtonProps
  if (prevProps?.onClick) {
    prevProps.onClick(new MouseEvent('click'))
    return
  }
  if (stepIndex.value > 0) stepIndex.value -= 1
}

function goNext() {
  const nextProps = currentStep.value?.nextButtonProps
  if (nextProps?.onClick) {
    nextProps.onClick(new MouseEvent('click'))
    return
  }
  if (stepIndex.value < totalSteps.value - 1) {
    stepIndex.value += 1
    return
  }
  setOpen(false)
  emit('finish')
}

const isLast = computed(() => stepIndex.value >= totalSteps.value - 1)
</script>

<template>
  <Teleport
    v-if="isOpen"
    :to="teleportTarget.to"
    :disabled="teleportTarget.disabled"
  >
    <div
      v-bind="rootAttrs"
      class="m-tour"
      :style="{ zIndex: overlayZ }"
      role="dialog"
      aria-modal="true"
    >
      <div
        v-if="mask"
        class="m-tour__mask"
        aria-hidden="true"
        @click="setOpen(false)"
      >
        <div
          class="m-tour__spotlight"
          :style="spotlightStyle"
        />
      </div>

      <div
        ref="panelRef"
        class="m-tour__panel"
        :class="[`m-tour__panel--${panelType}`]"
        :style="panelStyle"
      >
        <button
          type="button"
          class="m-tour__close"
          :aria-label="locale.close"
          @click="setOpen(false)"
        >
          <MIcon
            name="close"
            size="sm"
          />
        </button>

        <div
          v-if="typeof currentStep?.cover === 'string'"
          class="m-tour__cover"
        >
          {{ currentStep.cover }}
        </div>

        <div class="m-tour__header">
          <div
            v-if="currentStep?.title"
            class="m-tour__title"
          >
            {{ currentStep.title }}
          </div>
        </div>

        <div
          v-if="currentStep?.description"
          class="m-tour__description"
        >
          {{ currentStep.description }}
        </div>

        <div class="m-tour__footer">
          <span class="m-tour__indicators">
            {{ stepIndex + 1 }} / {{ totalSteps }}
          </span>
          <div class="m-tour__actions">
            <MButton
              v-if="stepIndex > 0"
              size="small"
              severity="secondary"
              variant="text"
              @click="goPrev"
            >
              {{ currentStep?.prevButtonProps?.children ?? labels.prev }}
            </MButton>
            <MButton
              size="small"
              :severity="panelType === 'primary' ? 'primary' : 'secondary'"
              @click="goNext"
            >
              {{ isLast
                ? (currentStep?.nextButtonProps?.children ?? labels.finish)
                : (currentStep?.nextButtonProps?.children ?? labels.next) }}
            </MButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
