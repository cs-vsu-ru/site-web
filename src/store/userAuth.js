import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const userAuth = defineStore('auth', {
  state: () => ({
    isAuth: useStorage('token', '')
  }),

  getters: {
    getIsAuth: (state) => state.isAuth
  },

  actions: {
    setAuth(authChecker) {
      this.isAuth = authChecker
    }
  }
})