import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface WiseKitNuxtOptions {
  /** Import `@wise-kit/ui/styles.css`. Default `true`. */
  css?: boolean
  /** Add `@wise-kit/ui` to `build.transpile`. Default `true`. */
  transpile?: boolean
}

export default defineNuxtModule<WiseKitNuxtOptions>({
  meta: {
    name: '@wise-kit/nuxt',
    configKey: 'WiseKit',
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
      nuxt.options.build.transpile.push('@wise-kit/ui')
    }

    if (options.css) {
      nuxt.options.css.push('@wise-kit/ui/styles.css')
    }

    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})
