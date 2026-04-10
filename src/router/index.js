import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import AllTeachers from "@/views/AllTeachers.vue";
import AllNews from "@/views/AllNews.vue";
import Profile from "@/views/Profile.vue";
import {userAuth} from "@/store/userAuth";
import NewPage from "@/views/NewPage.vue";
import Admin from "@/views/Admin";
import Schedule from "@/views/Schedule.vue";
import CreateUser from "@/views/CreateUser.vue";
import CreateStudent from "@/views/CreateStudent.vue";
import CreateNews from "@/views/CreateNews";
import AllEvents from "@/views/AllEvents";
import EventPage from "@/views/EventPage"
import FullSchedule from "@/views/FullSchedule"
import CreateMail from "@/views/CreateMail"
import CreateEvent from "@/views/CreateEvent";
import EditMail from "@/views/EditMail";
import TabPage from "@/views/TabPage.vue";

const routes = [
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
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
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
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/admin/create_student',
    name: 'CreateStudent',
    component: CreateStudent,
    beforeEnter: async (to, from, next) => {
      const store = userAuth()

      if (store.getIsAuth !== '') {
        let role = store.getRole
        role === 'ADMIN' || role === 'MODERATOR' ? next() : next('/')
      }
      else {
        next('/')
      }
    }
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
      }
      else {
        next('/')
      }
    }
  },
  {
    path: '/:pageName',
    name: 'TabPage',
    component: TabPage
  },
  {
    path: '/:pathMatch(.*)*',
    component: MainPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
