import { defineStore } from 'pinia'
import axios from 'axios'

let visibleLoadPromise = null
let allLoadPromise = null

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    visibleTabs: [],
    allTabs: [],
    isLoadingVisible: false,
    isLoadingAll: false,
    visibleLoaded: false,
    allLoaded: false,
  }),

  getters: {
    findTabByUrl: (state) => (url) => {
      return state.allTabs.find((t) => t.url === url)
        || state.visibleTabs.find((t) => t.url === url)
        || null
    },
  },

  actions: {
    async loadVisibleTabs(force = false) {
      if (this.visibleLoaded && !force) return
      if (visibleLoadPromise) return visibleLoadPromise

      this.isLoadingVisible = true
      visibleLoadPromise = (async () => {
        try {
          const { data } = await axios.get('tabs/visible')
          this.visibleTabs = data.sort((a, b) => a.sortOrder - b.sortOrder)
          this.visibleLoaded = true
        } catch (e) {
          this.visibleTabs = []
        } finally {
          this.isLoadingVisible = false
          visibleLoadPromise = null
        }
      })()
      return visibleLoadPromise
    },

    async loadAllTabs(force = false) {
      if (this.allLoaded && !force) return
      if (allLoadPromise) return allLoadPromise

      this.isLoadingAll = true
      allLoadPromise = (async () => {
        try {
          const { data } = await axios.get('tabs')
          this.allTabs = data.sort((a, b) => a.sortOrder - b.sortOrder)
          this.allLoaded = true
        } catch (e) {
          this.allTabs = []
        } finally {
          this.isLoadingAll = false
          allLoadPromise = null
        }
      })()
      return allLoadPromise
    },

    async invalidate() {
      this.visibleLoaded = false
      this.allLoaded = false
      await Promise.all([
        this.loadVisibleTabs(true),
        this.loadAllTabs(true),
      ])
    },
  },
})
