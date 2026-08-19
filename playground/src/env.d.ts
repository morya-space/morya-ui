/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '*.md' {
  import type { Component, DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
  export const frontmatter: Record<string, unknown>
}

declare module '*?raw' {
  const src: string
  export default src
}

declare module '*.json' {
  const value: Record<string, unknown>
  export default value
}
