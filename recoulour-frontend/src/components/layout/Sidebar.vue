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

<script>
import { Button } from 'primevue';

class SidebarItem {
  constructor(title, icon, path) {
    this.title = title;
    this.icon = icon;
    this.path = path;
  }
}

export default {
  name: 'SidebarPanel',
  data() {
    return {
      activeSection: 'dashboard',
      openSubmenu: {
        tickets: false
      },
      sidebarItems: [
        new SidebarItem('Dashboard', 'pi-home', '/'),
        new SidebarItem('Create Ticket', 'pi-plus', '/create-ticket'),
        new SidebarItem('Queue', 'pi-list', '/queue'),
        new SidebarItem('Approved', 'pi-check-circle', '/approved'),
        new SidebarItem('Partners', 'pi-users', '/partners')
      ]
    }
  },
  methods: {
    setActive(item) {
      this.activeSection = item.title.toLowerCase().replace(' ', '');
      if (item.path && this.$route.path !== item.path) {
        this.$router.push(item.path);
      }
    }
  },
  watch: {
    '$route.path': {
      handler(path) {
        const item = this.sidebarItems.find(i => i.path === path);
        if (item) {
          this.activeSection = item.title.toLowerCase().replace(' ', '');
        }
      },
      immediate: true
    }
  },
  components: {
    Button
  }
}
</script>
