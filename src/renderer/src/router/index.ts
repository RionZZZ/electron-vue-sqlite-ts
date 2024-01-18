import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
// eslint-disable-next-line import/no-unresolved
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-unresolved
import generatedRoutes from 'virtual:generated-pages'
import { UserStore } from '@renderer/stores'
import NProgress from '@renderer/modules/progress'

const layoutViews: RouteRecordRaw[] = []
const noLayoutViews: RouteRecordRaw[] = []
generatedRoutes.forEach(route => {
  if (route.meta?.layout !== false) {
    layoutViews.push(route)
  } else {
    noLayoutViews.push(route)
  }
})
const routes = [...setupLayouts(layoutViews), ...noLayoutViews, { path: '/', redirect: '/login' }]
// const routes: RouteConfig[] = generatedRoutes
console.log(routes)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(to => {
  NProgress.start()
  const userStore = UserStore()
  console.log(to)
  if (!userStore.token && to.name !== 'login') {
    return { name: 'login' }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
