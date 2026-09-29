import type { InjectionKey } from 'vue'
import type { AnchorDirection } from './types'

export interface AnchorContext {
  registerLink: (href: string, targetOffset?: number) => void
  unregisterLink: (href: string) => void
  activeLink: { value: string | null }
  direction: AnchorDirection
  scrollTo: (href: string, targetOffset?: number) => void
  onLinkClick: (
    event: MouseEvent,
    link: { href: string; title?: unknown },
    targetOffset?: number,
  ) => void
}

export const anchorContextKey: InjectionKey<AnchorContext> = Symbol('m-anchor')
