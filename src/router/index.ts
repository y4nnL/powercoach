import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PVideosRoute from '@/components/routes/PVideosRoute.vue'
import PVideoRoute from '@/components/routes/PVideoRoute.vue'
import PHomeRoute from '@/components/routes/PHomeRoute.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PHomeRoute
  },
  {
    path: '/videos',
    children: [
      {
        path: '',
        name: 'videos',
        component: PVideosRoute
      },
      {
        path: ':id',
        name: 'video',
        component: PVideoRoute,
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
