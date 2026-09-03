export interface TerminalProps {
  welcomeMessage?: string
  prompt?: string
  /** Controlled command history (`v-model:lines`). Uncontrolled when omitted. */
  lines?: string[]
  /** Controlled response lines displayed after each command (`v-model:responses`). */
  responses?: string[]
}

export interface TerminalEmits {
  (event: 'command', value: string): void
  (event: 'update:lines', value: string[]): void
  (event: 'update:responses', value: string[]): void
}
