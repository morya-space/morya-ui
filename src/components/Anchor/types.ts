import type { RootPassThrough } from '../../shared/passThrough'
import type { VNodeChild } from 'vue'

export type AnchorDirection = 'vertical' | 'horizontal'

export type AnchorContainer = HTMLElement | Window

export interface AnchorLinkItem {
  key?: string | number
  href: string
  title?: VNodeChild | string
  target?: string
  replace?: boolean
  targetOffset?: number
  children?: AnchorLinkItem[]
}

export interface AnchorLinkProps {
  pt?: RootPassThrough
  href: string
  title?: VNodeChild | string
  target?: string
  replace?: boolean
  targetOffset?: number
}

export interface AnchorProps {
  pt?: RootPassThrough
  /** Declarative link tree. Prefer over default slot. */
  items?: AnchorLinkItem[]
  direction?: AnchorDirection
  /** Scroll offset for spy + scroll target. */
  offsetTop?: number
  /** Alias for `bounds`. Default `5`. */
  bounds?: number
  /** Alias for `bounds` (`bound`). */
  bound?: number
  /** Scroll offset when clicking a link; falls back to `offsetTop`. */
  targetOffset?: number
  /** Pin nav while scrolling. Default `true`. */
  affix?: boolean
  /** Scroll container. Default `window`. */
  getContainer?: () => AnchorContainer
  /** Customize highlighted href from computed active link. */
  getCurrentAnchor?: (activeLink: string) => string
  /** Use `history.replaceState` when clicking in-page hash links. */
  replace?: boolean
}

export interface AnchorEmits {
  change: [activeLink: string]
  click: [event: MouseEvent, link: { href: string; title?: VNodeChild | string }]
}

export interface AnchorLinkEmits {
  click: [event: MouseEvent]
}
