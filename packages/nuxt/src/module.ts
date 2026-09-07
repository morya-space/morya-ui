import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface RoostDesignNuxtOptions {
  /** Import `@roost-design/ui/styles.css`. Default `true`. */
  css?: boolean
  /** Add `@roost-design/ui` to `build.transpile`. Default `true`. */
  transpile?: boolean
}

/** @deprecated Use `RoostDesignNuxtOptions` */
export type WexDesignNuxtOptions = RoostDesignNuxtOptions

export default defineNuxtModule<RoostDesignNuxtOptions>({
  meta: {
    name: '@roost-design/nuxt',
    configKey: 'RoostDesign',
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
      nuxt.options.build.transpile.push('@roost-design/ui')
    }

    if (options.css) {
      nuxt.options.css.push('@roost-design/ui/styles.css')
    }

    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })
  },
})
