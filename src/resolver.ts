import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface WiseKitResolverOptions {
  /** Component name prefix. Default: `Rd`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `Rd*` components to
 * on-demand subpath imports such as `@wise-kit/ui/button`.
 */
export function WiseKitResolver(options: WiseKitResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Rd'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const slug = componentImportMap[name]
      if (!slug) return
      return {
        name,
        from: `@wise-kit/ui/${slug}`,
      }
    },
  }
}

export { componentImportMap }

/** @deprecated Use `WiseKitResolver` */
export const WexDesignResolver = WiseKitResolver
/** @deprecated Use `WiseKitResolverOptions` */
export type WexDesignResolverOptions = WiseKitResolverOptions
