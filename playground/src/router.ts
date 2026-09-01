import { createRouter, createWebHistory } from 'vue-router'

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
      // 兼容旧路径 /Button → /components/Button
      path: '/:component',
      redirect: (to) => ({
        name: 'component-doc',
        params: { component: String(to.params.component) },
      }),
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
