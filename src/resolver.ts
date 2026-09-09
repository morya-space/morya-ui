import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface MoryaUIResolverOptions {
  /** Component name prefix. Default: `M`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `M*` components to
 * on-demand subpath imports such as `morya-ui/button`.
 */
export function MoryaUIResolver(options: MoryaUIResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'M'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const slug = componentImportMap[name]
      if (!slug) return
      return {
        name,
        from: `morya-ui/${slug}`,
      }
    },
  }
}

export { componentImportMap }
