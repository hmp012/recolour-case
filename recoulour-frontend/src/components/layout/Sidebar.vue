<template>
  <div style="display: flex; flex-direction: column; padding-inline: 2vw; padding-block: 1.5vh; gap: 3vh;">
    <Button 
      v-for="item in sidebarItems" 
      :key="item.title"
      @click="item.action"
      :class="{ active: activeSection === item.title.toLowerCase() }"
    >
      <i :class="`pi ${item.icon}`"></i>
      {{ item.title }}
    </Button>
  </div>
</template>

<script>
import { Button } from 'primevue';

class SidebarItem {
  constructor(title, icon, action) {
    this.title = title;
    this.icon = icon;
    this.action = action;
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
        new SidebarItem('Dashboard', 'pi-home', () => this.setActive('dashboard')),
        new SidebarItem('Tickets', 'pi-list', () => this.setActive('tickets')),
        new SidebarItem('Partners', 'pi-users', () => this.setActive('partners'))
      ]
    }
  },
  methods: {
    setActive(section) {
      this.activeSection = section;
    }
  },
  components: {
    Button
  }
}
</script>
