import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface WexDesignResolverOptions {
  /** Component name prefix. Default: `Wd`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `Wd*` components to
 * on-demand subpath imports such as `@wex-design/ui/button`.
 */
export function WexDesignResolver(options: WexDesignResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Wd'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const slug = componentImportMap[name]
      if (!slug) return
      return {
        name,
        from: `@wex-design/ui/${slug}`,
      }
    },
  }
}

export { componentImportMap }
