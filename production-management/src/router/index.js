import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/details',
    name: 'details',
    component: () => import('@/views/DetailsView.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductsView.vue')
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue')
  },
  {
    path: '/counterparties',
    name: 'counterparties',
    component: () => import('@/views/CounterpartiesView.vue')
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import('@/views/LogsView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const token = await Cookies.get('token')
  const tokenExpiration = await Cookies.get('token_expiration')

  if (to.path !== '/home') {
    if (token && tokenExpiration && new Date(tokenExpiration) > new Date()) {
      if (to.path === '/') {
        next('/details')
      } else {
        next()
      }
    } else {
      Cookies.remove('token')
      Cookies.remove('token_expiration')
      next('/home')
    }
  } else {
    next()
  }
})

export default router
