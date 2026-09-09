import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface MoryaUINuxtOptions {
  /** Import `morya-ui/styles.css`. Default `true`. */
  css?: boolean
  /** Add `morya-ui` to `build.transpile`. Default `true`. */
  transpile?: boolean
}

export default defineNuxtModule<MoryaUINuxtOptions>({
  meta: {
    name: '@morya-space/nuxt',
    configKey: 'moryaUI',
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
      nuxt.options.build.transpile.push('morya-ui')
    }

    if (options.css) {
      nuxt.options.css.push('morya-ui/styles.css')
    }

    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})
