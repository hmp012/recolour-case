<template>
    <div class="sidebar">
        <nav class="sidebar-nav">
            <button class="nav-item" :class="{ active: activeSection === 'dashboard' }" @click="setActive('dashboard')">
                <i class="pi pi-home"></i> Dashboard
            </button>
            <button class="nav-item" :class="{ active: activeSection === 'tickets' }" @click="toggleSubmenu('tickets')">
                <i class="pi pi-list"></i> Tickets <i class="pi pi-chevron-down" :style="{ transform: openSubmenu.tickets ? 'rotate(180deg)' : 'rotate(0)' }"></i>
            </button>
            <div v-if="openSubmenu.tickets" class="submenu">
                <button class="submenu-item">View Queue <span class="badge">{{ pendingCount }}</span></button>
                <button class="submenu-item">Approved Library <span class="badge">{{ reviewCount }}</span></button>
            </div>
            <button class="nav-item" :class="{ active: activeSection === 'partners' }" @click="setActive('partners')">
                <i class="pi pi-users"></i> Partners
            </button>
        </nav>
    </div>
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

<style scoped>
.sidebar {
  width: 250px;
  background-color: #0f172a;
  padding: 1rem 0;
  height: calc(100vh - 70px);
  overflow-y: auto;
  border-right: 1px solid #1e293b;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #cbd5e1;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #1e293b;
  color: white;
}

.nav-item.active {
  background-color: #3b82f6;
  color: white;
}

.nav-item i:first-child {
  width: 20px;
}

.nav-item i:last-child {
  margin-left: auto;
  font-size: 0.75rem;
}

.submenu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 2rem;
}

.submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.submenu-item:hover {
  background-color: #1e293b;
  color: #cbd5e1;
}

.badge {
  display: inline-block;
  background-color: #ef4444;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}
</style>