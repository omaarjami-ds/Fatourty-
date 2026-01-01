import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AjouterJournee from '../views/AjouterJournee.vue'
import Livreurs from '../views/Livreurs.vue'
import Motors from '../views/Motors.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/ajouter-journee',
      name: 'AjouterJournee',
      component: AjouterJournee
    },
    {
      path: '/livreurs',
      name: 'Livreurs',
      component: Livreurs
    },
    {
      path: '/motors',
      name: 'Motors',
      component: Motors
    },
    {
      path: '/inventaire',
      name: 'Inventaire',
      component: () => import('@/views/Inventaire.vue')
    }
  ],
})

export default router
