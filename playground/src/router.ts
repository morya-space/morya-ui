import { createRouter, createWebHistory } from 'vue-router'
import ChangelogView from './views/ChangelogView.vue'
import ComponentPlayground from './views/ComponentPlayground.vue'
import DocsView from './views/DocsView.vue'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/docs',
      redirect: { name: 'docs', params: { slug: 'introduction' } },
    },
    {
      path: '/docs/:slug',
      name: 'docs',
      component: DocsView,
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentPlayground,
    },
    {
      path: '/components/:component',
      name: 'component-doc',
      component: ComponentPlayground,
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: ChangelogView,
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
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
