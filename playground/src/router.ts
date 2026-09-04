import { createRouter, createWebHistory } from 'vue-router'
import { SITE_NAME } from './config/site'
import { listDocumentedComponentNames } from './docs/loadComponentDocs'

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

router.afterEach((to) => {
  if (typeof document === 'undefined') return

  const suffix = ` · ${SITE_NAME}`
  if (to.name === 'home') {
    document.title = SITE_NAME
    return
  }
  if (to.name === 'docs') {
    document.title = `Docs${suffix}`
    return
  }
  if (to.name === 'components' || to.name === 'component-doc') {
    const component = typeof to.params.component === 'string' ? to.params.component : ''
    document.title = component ? `${component}${suffix}` : `Components${suffix}`
    return
  }
  if (to.name === 'changelog') {
    document.title = `Changelog${suffix}`
    return
  }
  document.title = SITE_NAME
})

export default router
