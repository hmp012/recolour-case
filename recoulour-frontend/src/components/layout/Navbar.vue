<template>
  <div style="display: flex; flex-direction: row;">
    <div style="display: flex; align-items: center; gap: 1.5vw; padding-inline: 1vw;">
      <h1>Recoulour Manager</h1>
    </div>
    <div style="display: flex; align-items: center; gap: 1.5vw; padding-inline: 1vw; margin-left: auto;">
      <Tag style="font-size: 20px; padding: 0.6vw; padding-inline: 1vw;" :value="authStore.isManager ? 'Manager' : 'Employee'" severity="info" />
      <Button label="Toggle Role" @click="authStore.toggleRole" :disabled="authStore.isAnimating" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'AppNavbar',
  components: {
    Button,
    Tag
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
