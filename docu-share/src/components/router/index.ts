import { createRouter, createWebHistory } from 'vue-router'
//view imports
import HomeView from '../views/HomeView.vue' 
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DocsView from '../views/DocsView.vue'
import DocView from "../views/DocView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/docs",
      name: "docs",
      component: DocsView
    },
    {
      path: '/docs/:slug',
      name: 'doc',
      component: DocView,
   }
  ]
})

export default router
