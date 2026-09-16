import { createRouter, createWebHistory } from 'vue-router'
import { SITE_NAME } from './config/site'
import { listDocumentedComponentNames } from './docs/loadComponentDocs'
import { setPageHead } from './seo/pageHead'
import componentDocsManifest from 'virtual:component-docs-manifest'
import guideDocsManifest from 'virtual:guide-docs-manifest'

const LEGACY_COMPONENT_NAMES = new Set(
  listDocumentedComponentNames().map((name) => name.toLowerCase()),
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue'),
    },
    {
      path: '/docs',
      redirect: { name: 'docs', params: { slug: 'introduction' } },
    },
    {
      path: '/docs/:slug',
      name: 'docs',
      component: () => import('./views/DocsView.vue'),
    },
    {
      path: '/components',
      name: 'components',
      component: () => import('./views/ComponentPlayground.vue'),
    },
    {
      path: '/components/:component',
      name: 'component-doc',
      component: () => import('./views/ComponentPlayground.vue'),
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('./views/ChangelogView.vue'),
    },
    {
      path: '/components-demos',
      name: 'components-demos',
      component: () => import('./views/components-demos-view/ComponentsDemosView.vue'),
      meta: {
        title: '开发调试组件页面：不对外',
      },
    },
    {
      // 兼容旧路径 /Button → /components/Button（仅已知组件名）
      path: '/:component',
      redirect: (to) => {
        const name = String(to.params.component ?? '')
        if (LEGACY_COMPONENT_NAMES.has(name.toLowerCase())) {
          return { name: 'component-doc', params: { component: name } }
        }
        return { name: 'not-found' }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('./views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

function manifestText(
  entry: Record<string, string> | undefined,
  key: 'title' | 'description',
): string | undefined {
  const value = entry?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

router.afterEach((to) => {
  if (typeof document === 'undefined') return

  const suffix = ` · ${SITE_NAME}`
  const path = to.path

  if (to.name === 'home') {
    setPageHead({
      title: `${SITE_NAME} — Vue 3 Component Library`,
      path,
    })
    return
  }

  if (to.name === 'docs') {
    const slug = typeof to.params.slug === 'string' ? to.params.slug : ''
    const entry = guideDocsManifest[slug]?.['zh-CN'] ?? guideDocsManifest[slug]?.['en-US']
    const guideTitle = manifestText(entry, 'title') ?? slug
    setPageHead({
      title: `${guideTitle}${suffix}`,
      description: manifestText(entry, 'description'),
      path,
    })
    return
  }

  if (to.name === 'components') {
    setPageHead({
      title: `Components${suffix}`,
      description: 'Browse 90+ Vue 3 components in Morya UI with interactive API docs and live previews.',
      path,
    })
    return
  }

  if (to.name === 'component-doc') {
    const component = typeof to.params.component === 'string' ? to.params.component : ''
    const entry = componentDocsManifest[component]?.['zh-CN']
      ?? componentDocsManifest[component]?.['en-US']
    setPageHead({
      title: component ? `${component}${suffix}` : `Components${suffix}`,
      description: manifestText(entry, 'description'),
      path,
    })
    return
  }

  if (to.name === 'changelog') {
    setPageHead({
      title: `Changelog${suffix}`,
      description: 'Release notes and breaking changes for Morya UI.',
      path,
    })
    return
  }

  if (to.name === 'components-demos') {
    setPageHead({
      title: `Component demos${suffix}`,
      path,
    })
    return
  }

  setPageHead({
    title: SITE_NAME,
    path,
  })
})

export default router
