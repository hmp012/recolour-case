<template>
    <nav class="navbar">
        <div class="navbar-left">
        <h1 class="navbar-title">Recolour</h1>
        </div>
        <div class="navbar-right">
        <button class="logout-button" @click="logout">Logout</button>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  methods: {
    logout() {
      // Handle logout logic
      console.log('Logout clicked');
    }
  }
}
</script>
