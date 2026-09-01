import { createRouter, createWebHistory } from 'vue-router'
import { listDocumentedComponentNames } from './docs/loadComponentDocs'

const LEGACY_COMPONENT_NAMES = new Set(
  listDocumentedComponentNames().map((name) => name.toLowerCase()),
)

const router = createRouter({
  history: createWebHistory(),
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

export default router
