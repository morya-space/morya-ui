<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { TerminalEmits, TerminalProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, nextTick, ref, useAttrs } from 'vue'
import { useMLocale } from '../../locale'

const props = withDefaults(defineProps<TerminalProps>(), {
  welcomeMessage: 'Welcome to Morya UI Terminal',
  prompt: '>',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const emit = defineEmits<TerminalEmits>()

const locale = useMLocale()
const draft = ref('')
const innerLines = ref<string[]>([])
const innerResponses = ref<string[]>([])
const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const historyPointer = ref(-1)

const displayLines = computed(() => props.lines ?? innerLines.value)
const displayResponses = computed(() => props.responses ?? innerResponses.value)

function appendLine(command: string) {
  const next = [...displayLines.value, command]
  innerLines.value = next
  emit('update:lines', next)
}

function appendResponse(text: string) {
  const next = [...displayResponses.value]
  const index = Math.max(0, displayLines.value.length - 1)
  next[index] = text
  innerResponses.value = next
  emit('update:responses', next)
}

async function submit() {
  const command = draft.value.trim()
  if (!command) return
  appendLine(command)
  emit('command', command)
  draft.value = ''
  historyPointer.value = -1
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

function onInputKeydown(event: KeyboardEvent) {
  const history = displayLines.value
  if (event.key === 'ArrowUp') {
    if (!history.length) return
    event.preventDefault()
    if (historyPointer.value < 0) historyPointer.value = history.length
    historyPointer.value = Math.max(0, historyPointer.value - 1)
    draft.value = history[historyPointer.value] ?? ''
    return
  }
  if (event.key === 'ArrowDown') {
    if (historyPointer.value < 0) return
    event.preventDefault()
    historyPointer.value += 1
    if (historyPointer.value >= history.length) {
      historyPointer.value = -1
      draft.value = ''
    } else {
      draft.value = history[historyPointer.value] ?? ''
    }
  }
}

defineExpose({ appendResponse, focus: () => inputRef.value?.focus() })
</script>

<template>
  <div v-bind="rootAttrs" class="m-terminal">
    <div ref="bodyRef" class="m-terminal__body" role="log" aria-live="polite" :aria-label="locale.terminal">
      <div v-if="welcomeMessage" class="m-terminal__welcome">
        {{ welcomeMessage }}
      </div>
      <template v-for="(line, index) in displayLines" :key="`${line}-${index}`">
        <div class="m-terminal__line">
          <span class="m-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
          <span>{{ line }}</span>
        </div>
        <div v-if="displayResponses[index]" class="m-terminal__response">
          {{ displayResponses[index] }}
        </div>
      </template>
    </div>
    <form class="m-terminal__form" @submit.prevent="submit">
      <span class="m-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
      <input
        ref="inputRef"
        v-model="draft"
        class="m-terminal__input"
        type="text"
        :aria-label="locale.commandInput"
        autocomplete="off"
        spellcheck="false"
        @keydown="onInputKeydown"
      >
    </form>
  </div>
</template>
