import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface WiseKitResolverOptions {
  /** Component name prefix. Default: `Wk`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `Wk*` components to
 * on-demand subpath imports such as `@wise-kit/ui/button`.
 */
export function WiseKitResolver(options: WiseKitResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Wk'

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
