import { createRouter, createWebHistory } from 'vue-router'
import HiringView from './views/HiringView.vue'
import WorkersView from './views/WorkersView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workers' },
    { path: '/workers', name: 'workers', component: WorkersView },
    { path: '/hiring', name: 'hiring', component: HiringView },
  ],
})
