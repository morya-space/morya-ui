import './style'
export { default as MDialog } from './Dialog.vue'
export type {
  DialogClickGuard,
  DialogCloseGuard,
   DialogEmits,
   DialogPassThrough,
   DialogPosition,
  DialogProps,
  DialogType,
} from './types'
export { modal, useModal, useModalCleanup } from './useModal'
export type { ModalStaticApi, ModalStaticHandle, ModalStaticOptions } from './useModal'
