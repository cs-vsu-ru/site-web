import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const userAuth = defineStore('auth', {
  state: () => ({
    isAuth: useStorage('token', ''),
    pplRole: ''
  }),

  getters: {
    getIsAuth: (state) => state.isAuth,
    getRole: (state) => state.pplRole
  },

  actions: {
    setAuth(authChecker, authRole) {
      this.isAuth = authChecker
      this.pplRole = authRole
    }
  }
})