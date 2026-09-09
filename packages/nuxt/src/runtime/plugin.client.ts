import { createMoryaUI } from 'morya-ui'
import { defineNuxtPlugin } from '#app'

/** Overlay context for toast/message; components stay on-demand via MoryaUIResolver. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createMoryaUI({ components: false }))
})
