import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
//   {
//     path: '/create-ticket',
//     name: 'CreateTicket',
//     component: () => import('@/views/CreateTicket.vue')
//   },
//   {
//     path: '/queue',
//     name: 'TicketQueue',
//     component: () => import('@/views/TicketQueue.vue')
//   },
//   {
//     path: '/approved',
//     name: 'ApprovedLibrary',
//     component: () => import('@/views/ApprovedLibrary.vue')
//   },
//   {
//     path: '/partners',
//     name: 'Partners',
//     component: () => import('@/views/Partners.vue')
//   }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
