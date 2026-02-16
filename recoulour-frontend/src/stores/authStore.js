import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isManager = ref(true)

  const toggleRole = () => {
    isManager.value = !isManager.value
  }

  return {
    isManager,
    toggleRole
  }
})
