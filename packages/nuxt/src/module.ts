import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface WellInsightNuxtOptions {
  /** Import `@well-insight/ui/styles.css`. Default `true`. */
  css?: boolean
  /** Add `@well-insight/ui` to `build.transpile`. Default `true`. */
  transpile?: boolean
}

export default defineNuxtModule<WellInsightNuxtOptions>({
  meta: {
    name: '@well-insight/nuxt',
    configKey: 'wellInsight',
    compatibility: {
      nuxt: '>=3.10.0',
    },
  },
  defaults: {
    css: true,
    transpile: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.transpile) {
      nuxt.options.build.transpile.push('@well-insight/ui')
    }

    if (options.css) {
      nuxt.options.css.push('@well-insight/ui/styles.css')
    }

    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})
