<template>
  <div class="app-layout">
    <AppNavbar />
    <div class="app-content">
      <SidebarPanel />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/layout/Navbar.vue'
import SidebarPanel from '@/components/layout/AppSidebar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    SidebarPanel
  }
}
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
  padding: 2rem;
  background-color: #f8fafc;
  overflow-y: auto;
}
</style>

