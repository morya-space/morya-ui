import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface WellInsightResolverOptions {
  /** Component name prefix. Default: `Wi`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `Wi*` components to
 * on-demand subpath imports such as `@well-insight/ui/button`.
 */
export function WellInsightResolver(options: WellInsightResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Wi'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const slug = componentImportMap[name]
      if (!slug) return
      return {
        name,
        from: `@well-insight/ui/${slug}`,
      }
    },
  }
}

export { componentImportMap }
