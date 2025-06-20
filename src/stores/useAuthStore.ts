import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ username: string; role: string } | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      user.value = {
        username: payload.sub,
        role: payload.role
      }
    } catch (e) {
      token.value = null
      localStorage.removeItem('token')
    }
  }

  function login(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    const payload = JSON.parse(atob(newToken.split('.')[1]))
    user.value = {
      username: payload.sub,
      role: payload.role
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
})
