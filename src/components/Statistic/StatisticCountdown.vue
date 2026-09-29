<script setup lang="ts">
import type { StatisticCountdownProps } from './types'
import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import Statistic from './Statistic.vue'
import { formatCountdown } from './utils'

const props = withDefaults(defineProps<StatisticCountdownProps>(), {
  format: 'HH:mm:ss',
  value: 0,
})

const emit = defineEmits<{
  finish: []
  change: [remainingMs: number]
}>()

const tick = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const normalizedValue = computed(() => {
  if (props.value instanceof Date) return props.value.getTime()
  return props.value ?? 0
})

const displayValue = computed(() => {
  tick.value
  return formatCountdown(normalizedValue.value, props.format)
})

function remainingMs(): number {
  const target = new Date(normalizedValue.value).getTime()
  if (!Number.isFinite(target)) return 0
  return Math.max(target - Date.now(), 0)
}

function pulse() {
  const left = remainingMs()
  emit('change', left)
  tick.value += 1
  if (left <= 0) {
    emit('finish')
    stopTimer()
  }
}

function startTimer() {
  stopTimer()
  pulse()
  timer = setInterval(pulse, 1000)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}

onMounted(startTimer)
onBeforeUnmount(stopTimer)

watch(normalizedValue, startTimer)

const {
  pt,
  title,
  prefix,
  suffix,
  valueStyle,
  loading,
  decimalSeparator,
  groupSeparator,
} = toRefs(props)
</script>

<template>
  <Statistic
    :pt="pt"
    :title="title"
    :prefix="prefix"
    :suffix="suffix"
    :value-style="valueStyle"
    :loading="loading"
    :decimal-separator="decimalSeparator"
    :group-separator="groupSeparator"
  >
    <template #value>
      {{ displayValue }}
    </template>
  </Statistic>
</template>
