import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import AllTeachers from "@/views/AllTeachers.vue";
import AllNews from "@/views/AllNews.vue";
import Profile from "@/views/Profile.vue";
import {userAuth} from "@/store/userAuth";
import NewPage from "@/views/NewPage.vue";
import Admin from "@/views/Admin";
import axios from "axios";
import Schedule from "@/views/Schedule.vue";
import CreateUser from "@/views/CreateUser.vue";
import AboutCaf from "@/views/AboutCaf"
import Education from "@/views/Education"
import Students from "@/views/Students"
import Partners from "@/views/Partners"
import Address from "@/views/Address"
import Confident from "@/views/Confident"

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
    component: Profile
  },
  {
    path: '/news/new/:id',
    name: 'New',
    component: NewPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        await axios.get('account')
            .then((accData) => {
              accData.data.mainRole === 'ROLE_ADMIN' ? next() : next('/')
            })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/schedule/:id',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/admin/create_user',
    name: 'CreateUser',
    component: CreateUser,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        await axios.get('account')
            .then((accData) => {
              accData.data.mainRole === 'ROLE_ADMIN' ? next() : next('/')
            })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutCaf
  },
  {
    path: '/education',
    name: 'Education',
    component: Education
  },
  {
    path: '/students',
    name: 'Students',
    component: Students
  },
  {
    path: '/partners',
    name: 'Partners',
    component: Partners
  },
  {
    path: '/address',
    name: 'Address',
    component: Address
  },
  {
    path: '/confident',
    name: 'Confident',
    component: Confident
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
