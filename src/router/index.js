import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import Employees from "@/views/Employees.vue";
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
import Address from "@/views/Address"
import Confident from "@/views/Confident"
import CreateNews from "@/views/CreateNews";
import AllEvents from "@/views/AllEvents";
import EventPage from "@/views/EventPage"
import FullSchedule from "@/views/FullSchedule"
import CreateMail from "@/views/CreateMail"
import CreateEvent from "@/views/CreateEvent";
import EditMail from "@/views/EditMail";
import Exams from "@/views/Exams";
import Miscellaneous from "@/views/Miscellaneous.vue";
import Important from "@/views/Important.vue";

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
    component: Employees
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
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' || accData.data.mainRole === 'MODERATOR' ? next() : next('/')
        //     })
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
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' ? next() : next('/')
        //     })
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
    path: '/important',
    name: 'Important',
    component: Important
  },
  {
    path: '/miscellaneous',
    name: 'Miscellaneous',
    component: Miscellaneous
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
  },
  {
    path: '/admin/create_news',
    name: 'CreateNews',
    component: CreateNews,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' || accData.data.mainRole === 'MODERATOR' ? next() : next('/')
        //     })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/events',
    name: 'AllEvents',
    component: AllEvents
  },
  {
    path: '/events/:id',
    name: 'EventPage',
    component: EventPage
  },
  {
    path: '/full-schedule',
    name: 'FullSchedule',
    component: FullSchedule
  },
  {
    path: '/create-mail',
    name: 'CreateMail',
    component: CreateMail,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' || accData.data.mainRole === 'MODERATOR' ? next() : next('/')
        //     })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/create-event',
    name: 'CreateEvent',
    component: CreateEvent,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' || accData.data.mainRole === 'MODERATOR' ? next() : next('/')
        //     })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/edit-mail/:id',
    name: 'EditMail',
    component: EditMail,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
        // await axios.get('account')
        //     .then((accData) => {
        //       accData.data.mainRole === 'ADMIN' || accData.data.mainRole === 'MODERATOR' ? next() : next('/')
        //     })
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/exams',
    name: 'Exams',
    component: Exams
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
