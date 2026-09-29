import type { InjectionKey, Ref } from 'vue'
import type { RootPassThrough } from '../../shared/passThrough'

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

export interface ImageProps {
  pt?: RootPassThrough
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  /** Enable click-to-preview. Default `true`. */
  preview?: boolean
  /** Preview image src; defaults to `src`. */
  previewSrc?: string
  fit?: ImageFit
}

export interface ImageEmits {
  'click-preview': []
}

export interface ImagePreviewGroupProps {
  pt?: RootPassThrough
}

export interface ImagePreviewGroupContext {
  register: (src: string) => number
  unregister: (id: number) => void
  openAt: (id: number) => void
  previewOpen: Ref<boolean>
  activeIndex: Ref<number>
  images: Ref<string[]>
}

export const IMAGE_PREVIEW_GROUP_KEY: InjectionKey<ImagePreviewGroupContext> =
  Symbol('mImagePreviewGroup')
