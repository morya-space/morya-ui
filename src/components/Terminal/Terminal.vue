<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useWiLocale } from '../../locale'
import type { TerminalProps } from './types'

withDefaults(defineProps<TerminalProps>(), {
  welcomeMessage: 'Welcome to Well Insight Terminal',
  prompt: '>',
})

const emit = defineEmits<{
  (event: 'command', value: string): void
}>()

const locale = useWiLocale()
const draft = ref('')
const history = ref<string[]>([])
const bodyRef = ref<HTMLElement | null>(null)

async function submit() {
  const command = draft.value.trim()
  if (!command) return
  history.value = [...history.value, command]
  emit('command', command)
  draft.value = ''
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}
</script>

<template>
  <div class="wi-terminal" role="application" :aria-label="locale.terminal">
    <div ref="bodyRef" class="wi-terminal__body">
      <div v-if="welcomeMessage" class="wi-terminal__welcome">{{ welcomeMessage }}</div>
      <div v-for="(line, index) in history" :key="`${line}-${index}`" class="wi-terminal__line">
        <span class="wi-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
        <span>{{ line }}</span>
      </div>
    </div>
    <form class="wi-terminal__form" @submit.prevent="submit">
      <span class="wi-terminal__prompt" aria-hidden="true">{{ prompt }}</span>
      <input
        v-model="draft"
        class="wi-terminal__input"
        type="text"
        :aria-label="locale.commandInput"
        autocomplete="off"
        spellcheck="false"
      />
    </form>
  </div>
</template>
