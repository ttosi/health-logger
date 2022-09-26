import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsView from '@/views/TabsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/workouts'
  },
  {
    path: '/tabs/',
    component: TabsView,
    children: [
      {
        path: '',
        redirect: '/tabs/workouts'
      },
      {
        path: 'workouts',
        component: () => import('@/views/WorkoutsView.vue')
      },
      {
        path: 'graphs',
        component: () => import('@/views/GraphsView.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
