<template>

</template>

<script>
export default {
  name: 'SidebarPanel',
  data() {
    return {
      activeSection: 'dashboard',
      openSubmenu: {
        tickets: false
      },
      pendingCount: 5,
      reviewCount: 3
    }
  },
  methods: {
    setActive(section) {
      this.activeSection = section;
    },
    toggleSubmenu(menu) {
      this.openSubmenu[menu] = !this.openSubmenu[menu];
    }
  }
}
</script>