<template>
  <c-box>
    <AppNavbar />
    <c-flex>
      <SidebarPanel />
      <c-box flex="1" ml="250px" p="8" bg="gray.50" min-h="calc(100vh - 70px)">
        <router-view />
      </c-box>
    </c-flex>
  </c-box>
</template>

<script>
import AppNavbar from '@/components/layout/Navbar.vue'
import SidebarPanel from '@/components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    SidebarPanel
  }
}
</script>

<!-- <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}

#app {
  min-height: 100vh;
}
</style> -->
