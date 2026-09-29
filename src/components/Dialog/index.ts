import './style'
export { default as MDialog } from './Dialog.vue'
export { modal, useModal, useModalCleanup } from './useModal'
export type { ModalStaticApi, ModalStaticHandle, ModalStaticOptions } from './useModal'
export type {
  DialogClickGuard,
  DialogCloseGuard,
  DialogEmits,
  DialogPosition,
  DialogProps,
  DialogType,
} from './types'
