import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import AllTeachers from "@/views/AllTeachers.vue";
import AllNews from "@/views/AllNews.vue";
import Profile from "@/views/Profile.vue";
import {userAuth} from "@/store/userAuth";
import NewPage from "@/views/NewPage.vue";

const routes = [
  {
    path: '/:pathMatch(.*)*',
    component: MainPage
  },
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/teachers',
    name: 'AllTeachers',
    component: AllTeachers
  },
  {
    path: '/news',
    name: 'AllNews',
    component: AllNews
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile,
    // beforeEnter: (to, from, next) => {
    //   const store = userAuth()
    //
    //   store.getIsAuth === '' ? next('/') : next()
    // }
  },
  {
    path: '/news/new/:id',
    name: 'New',
    component: NewPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
