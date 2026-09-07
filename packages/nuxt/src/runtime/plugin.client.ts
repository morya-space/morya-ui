import { createRoostDesign } from '@roost-design/ui'
import { defineNuxtPlugin } from '#app'

/** Overlay context for toast/message; components stay on-demand via RoostDesignResolver. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createRoostDesign({ components: false }))
})
