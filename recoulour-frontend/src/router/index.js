import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/create-ticket',
    name: 'CreateTicket',
    component: () => import('@/views/CreateTicketView.vue')
  },
  {
    path: '/queue',
    name: 'TicketQueue',
    component: () => import('@/views/TicketQueueView.vue')
  },
  {
    path: '/approved',
    name: 'ApprovedLibrary',
    component: () => import('@/views/ApprovedLibraryView.vue')
  },
  {
    path: '/partners',
    name: 'Partners',
    component: () => import('@/views/PartnersView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
