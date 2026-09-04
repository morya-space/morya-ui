import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface WexDesignNuxtOptions {
  /** Import `@wex-design/ui/styles.css`. Default `true`. */
  css?: boolean
  /** Add `@wex-design/ui` to `build.transpile`. Default `true`. */
  transpile?: boolean
}

export default defineNuxtModule<WexDesignNuxtOptions>({
  meta: {
    name: '@wex-design/nuxt',
    configKey: 'wexDesign',
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
      nuxt.options.build.transpile.push('@wex-design/ui')
    }

    if (options.css) {
      nuxt.options.css.push('@wex-design/ui/styles.css')
    }

    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})
