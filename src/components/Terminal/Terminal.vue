<script setup lang="ts">
import type { TerminalEmits, TerminalProps } from './types'
import { computed, nextTick, ref } from 'vue'
import { useWiLocale } from '../../locale'

const props = withDefaults(defineProps<TerminalProps>(), {
  welcomeMessage: 'Welcome to Well Insight Terminal',
  prompt: '>',
})

const emit = defineEmits<TerminalEmits>()

const locale = useWiLocale()
const draft = ref('')
const innerLines = ref<string[]>([])
const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const historyPointer = ref(-1)

const displayLines = computed(() => props.lines ?? innerLines.value)
const displayResponses = computed(() => props.responses ?? [])

function appendLine(command: string) {
  const next = [...displayLines.value, command]
  innerLines.value = next
  emit('update:lines', next)
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
</script>

<template>
  <div class="wi-terminal">
    <div ref="bodyRef" class="wi-terminal__body" role="log" aria-live="polite" :aria-label="locale.terminal">
      <div v-if="welcomeMessage" class="wi-terminal__welcome">
        {{ welcomeMessage }}
      </div>
      <template v-for="(line, index) in displayLines" :key="`${line}-${index}`">
        <div class="wi-terminal__line">
          <span class="wi-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
          <span>{{ line }}</span>
        </div>
        <div v-if="displayResponses[index]" class="wi-terminal__response">
          {{ displayResponses[index] }}
        </div>
      </template>
    </div>
    <form class="wi-terminal__form" @submit.prevent="submit">
      <span class="wi-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
      <input
        ref="inputRef"
        v-model="draft"
        class="wi-terminal__input"
        type="text"
        :aria-label="locale.commandInput"
        autocomplete="off"
        spellcheck="false"
        @keydown="onInputKeydown"
      >
    </form>
  </div>
</template>
