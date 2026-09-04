import { createWexDesign } from '@wex-design/ui'
import { defineNuxtPlugin } from '#app'

/** Overlay context for toast/message; components stay on-demand via WexDesignResolver. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createWexDesign({ components: false }))
})
