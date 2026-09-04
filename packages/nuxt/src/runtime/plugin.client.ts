import { createWellInsight } from '@well-insight/ui'
import { defineNuxtPlugin } from '#app'

/** Overlay context for toast/message; components stay on-demand via WellInsightResolver. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createWellInsight({ components: false }))
})
