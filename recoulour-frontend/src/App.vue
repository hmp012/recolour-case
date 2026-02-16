<template>
  <div class="app-layout">
    <Toast />
    <AppNavbar />
    <div class="app-content">
      <SidebarPanel />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import SidebarPanel from '@/components/layout/AppSidebar.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #242323;
  overflow-y: auto;
}
</style>
