import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/details',
    name: 'details',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailsView.vue')
  },
  {
    path: '/products',
    name: 'products',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ProductsView.vue')
  },
  {
    path: '/orders',
    name: 'orders',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OrdersView.vue')
  },
  {
    path: '/counterparties',
    name: 'counterparties',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/SummaryInfoView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (to.path !== '/home') {
    // Проверка наличия токена
    if (token) {
      next()
    } else {
      // Если токена нет, перенаправляем на страницу входа
      next('/home')
    }
  } else {
    // Если пользователь уже находится на странице входа, просто продолжаем
    next()
  }
})

// router.beforeEach((to, from, next) => {
//   const token = sessionStorage.getItem('token')
//   const userRole = sessionStorage.getItem('role')
//   if (to.path !== '/home') {
//     // Проверка наличия токена
//     if (token) {
//       if (to.path !== '/details') {
//         next()
//       } else {
//         if (userRole === 1) {
//           next()
//         } else {
//           next('/orders')
//         }
//       }
//     } else {
//       next('/home')
//     }
//   } else {
//     // Если пользователь уже находится на странице входа, просто продолжаем
//     next()
//   }
// })

export default router
