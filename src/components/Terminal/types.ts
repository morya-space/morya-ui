export interface TerminalProps {
  welcomeMessage?: string
  prompt?: string
}

export interface TerminalEmits {
  (event: 'command', value: string): void
}
