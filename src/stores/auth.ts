import  { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  picture: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
  function setUser(newUser: User | null) {
    user.value = newUser
  }
  
  function setToken(newToken: string | null) {
    token.value = newToken
  }
  
  function login(userData: User, accessToken: string) {
    setUser(userData)
    setToken(accessToken)
  }
  
  function logout() {
    setUser(null)
    setToken(null)
  }
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
}, {
  persist: true
})
 