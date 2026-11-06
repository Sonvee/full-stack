import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuards } from './guards'
import { localRoutes } from './local-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: localRoutes,
})

setupRouterGuards(router)

export default router
