import { defineStore } from 'pinia'

interface UserStore {
  userName: string
  token: string
}

export default defineStore('user', {
  state: (): UserStore => ({
    userName: '',
    token: ''
  }),
  actions: {
    changeState(key: string, value: any) {
      this[key as keyof UserStore] = value
    },
    logout() {
      localStorage.clear()
      location.reload()
    }
  },
  persist: {
    storage: window.localStorage
  }
})
