import { createWiseKit } from '@wise-kit/ui'
import { defineNuxtPlugin } from '#app'

/** Overlay context for toast/message; components stay on-demand via WiseKitResolver. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createWiseKit({ components: false }))
})
