<template>
    <c-box bg="gray.800" color="white" px="4" py="4" box-shadow="md" pos="sticky" top="0" z-index="1000">
        <c-flex justify-content="space-between" align-items="center">
            <c-heading as="h1" size="lg" m="0">Recolour</c-heading>
            
            <c-hstack spacing="4">
                <c-badge color-scheme="blue">{{ authStore.isManager ? 'Manager' : 'Operator' }}</c-badge>
                <c-button size="sm" @click="authStore.toggleRole">Toggle Role</c-button>
            </c-hstack>
        </c-flex>
    </c-box>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AppNavbar',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
