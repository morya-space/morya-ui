import { componentImportMap } from './resolver-map'

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (
    name: string,
  ) => { name: string; from: string; sideEffects?: string[] } | undefined | null | void
}

export interface RoostDesignResolverOptions {
  /** Component name prefix. Default: `Rd`. */
  prefix?: string
}

/**
 * Resolver for `unplugin-vue-components` that maps `Rd*` components to
 * on-demand subpath imports such as `@roost-design/ui/button`.
 */
export function RoostDesignResolver(options: RoostDesignResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Rd'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const slug = componentImportMap[name]
      if (!slug) return
      return {
        name,
        from: `@roost-design/ui/${slug}`,
      }
    },
  }
}

export { componentImportMap }

/** @deprecated Use `RoostDesignResolver` */
export const WexDesignResolver = RoostDesignResolver
/** @deprecated Use `RoostDesignResolverOptions` */
export type WexDesignResolverOptions = RoostDesignResolverOptions
