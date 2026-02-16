<template>
  <div style="display: flex; flex-direction: column; padding-inline: 2vw; padding-block: 1.5vh; gap: 3vh;">
    <Button 
      v-for="item in sidebarItems" 
      :key="item.title"
      @click="setActive(item)"
      :class="{ active: activeSection === item.title.toLowerCase().replace(' ', '') }"
    >
      <i :class="`pi ${item.icon}`"></i>
      {{ item.title }}
    </Button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()

const activeSection = ref('dashboard')

const sidebarItems = [
  { title: 'Dashboard', icon: 'pi-home', path: '/' },
  { title: 'Create Ticket', icon: 'pi-plus', path: '/create-ticket' },
  { title: 'Queue', icon: 'pi-list', path: '/queue' },
  { title: 'Approved', icon: 'pi-check-circle', path: '/approved' },
  { title: 'Partners', icon: 'pi-users', path: '/partners' }
]

const setActive = (item) => {
  activeSection.value = item.title.toLowerCase().replace(' ', '')
  if (item.path && route.path !== item.path) {
    router.push(item.path)
  }
}

watch(
  () => route.path,
  (path) => {
    const item = sidebarItems.find(i => i.path === path)
    if (item) {
      activeSection.value = item.title.toLowerCase().replace(' ', '')
    }
  },
  { immediate: true }
)
</script>
