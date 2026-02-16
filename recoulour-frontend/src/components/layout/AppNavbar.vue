<template>
  <div style="display: flex; flex-direction: row; align-items: center; padding: 3vh 2vw; background: #222;">
    <div style="display: flex; align-items: center; gap: 1.5vw;">
      <h1 style="margin: 0; font-size: 5vh;">Recoulour Manager</h1>
    </div>
    <div style="display: flex; align-items: center; gap: 1vw; margin-left: auto;">
      <Button label="Toggle Role" size="small" @click="authStore.toggleRole" :disabled="authStore.isAnimating" />
      <Tag style="font-size: 3vh; padding: 1.5vh;" :value="authStore.isManager ? 'Manager' : 'Employee'" severity="info" />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const authStore = useAuthStore()
</script>
