<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '2rem' }">
    <!-- Header -->
    <div>
      <h1 :style="{ margin: 0, fontSize: '2rem', color: 'white' }">Operations Dashboard</h1>
      <p :style="{ margin: '0.5rem 0 0 0', color: '#94a3b8' }">Real-time overview of recolouring requests and library status</p>
    </div>

    <!-- KPI Cards -->
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }">
      <Card v-for="kpi in kpis" :key="kpi.label" :style="{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }">
        <template #content>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '1rem' }">
            <div :style="{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: kpi.bgColor,
              color: kpi.color
            }">
              <i :class="`pi ${kpi.icon}`" :style="{ fontSize: '1.5rem' }"></i>
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column' }">
              <span :style="{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }">{{ kpi.label }}</span>
              <span :style="{ fontSize: '1.75rem', color: 'white', fontWeight: '700' }">{{ kpi.value }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Secondary Content Row -->
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }">
      <!-- Recent Tickets -->
      <Card :style="{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }">
        <template #title>
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '1.25rem' }">
            <span>Recent Activity</span>
            <Button label="View All" text size="small" @click="$router.push('/queue')" />
          </div>
        </template>
        <template #content>
          <div v-if="loading" :style="{ display: 'flex', flexDirection: 'column', gap: '1rem' }">
             <div v-for="i in 5" :key="i" :style="{ height: '50px', backgroundColor: '#334155', borderRadius: '8px', animation: 'pulse 2s infinite' }"></div>
          </div>
          <div v-else-if="recentTickets.length === 0" :style="{ textAlign: 'center', padding: '2rem', color: '#64748b' }">
            No recent activity
          </div>
          <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
            <div v-for="ticket in recentTickets" :key="ticket.id" :style="{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.75rem', 
              borderRadius: '8px',
              backgroundColor: '#0f172a'
            }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '0.75rem' }">
                <div :style="{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(ticket.status) }"></div>
                <div :style="{ display: 'flex', flexDirection: 'column' }">
                  <span :style="{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }">{{ ticket.style }}</span>
                  <span :style="{ color: '#94a3b8', fontSize: '0.75rem' }">#{{ ticket.referenceCode }}</span>
                </div>
              </div>
              <Tag :value="ticket.status" :severity="getStatusSeverity(ticket.status)" size="small" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Status Distribution (Simple list for now) -->
      <Card :style="{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }">
        <template #title>
          <span :style="{ color: 'white', fontSize: '1.25rem' }">Queue Health</span>
        </template>
        <template #content>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }">
            <div v-for="stat in statusStats" :key="stat.status" :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
              <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }">
                <span :style="{ color: '#cbd5e1' }">{{ stat.status }}</span>
                <span :style="{ color: 'white', fontWeight: '600' }">{{ stat.count }} ({{ stat.percentage }}%)</span>
              </div>
              <div :style="{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }">
                <div :style="{ 
                  width: `${stat.percentage}%`, 
                  height: '100%', 
                  backgroundColor: getStatusColor(stat.status),
                  transition: 'width 0.5s ease-out'
                }"></div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ticketService } from '@/services/ticketService'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const tickets = ref([])
const loading = ref(false)

const fetchTickets = async () => {
  loading.value = true
  try {
    const response = await ticketService.getAll()
    tickets.value = response.data
  } catch (error) {
    console.error('Dashboard: Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}

const recentTickets = computed(() => {
  return [...tickets.value]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
})

const kpis = computed(() => [
  { 
    label: 'Total Tickets', 
    value: tickets.value.length, 
    icon: 'pi-ticket', 
    color: '#38bdf8', 
    bgColor: 'rgba(56, 189, 248, 0.1)' 
  },
  { 
    label: 'Tickets Pending', 
    value: tickets.value.filter(t => t.status === 'Pending').length, 
    icon: 'pi-clock', 
    color: '#94a3b8', 
    bgColor: 'rgba(148, 163, 184, 0.1)' 
  },
  { 
    label: 'In Progress', 
    value: tickets.value.filter(t => ['Sent', 'In Progress'].includes(t.status)).length, 
    icon: 'pi-sync', 
    color: '#fbbf24', 
    bgColor: 'rgba(251, 191, 36, 0.1)' 
  },
  { 
    label: 'Awaiting Approval', 
    value: tickets.value.filter(t => t.status === 'Completed' && !t.isApproved).length, 
    icon: 'pi-exclamation-circle', 
    color: '#f87171', 
    bgColor: 'rgba(248, 113, 113, 0.1)' 
  }
])

const statusStats = computed(() => {
  const statuses = ['Pending', 'Approved', 'Sent', 'In Progress', 'Completed', 'Rejected']
  const total = tickets.value.length || 1
  return statuses.map(s => {
    const count = tickets.value.filter(t => t.status === s).length
    return {
      status: s,
      count,
      percentage: Math.round((count / total) * 100)
    }
  }).filter(s => s.count > 0 || ['Pending', 'Completed'].includes(s.status))
})

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#94a3b8'
    case 'Sent': return '#6366f1'
    case 'In Progress': return '#f59e0b'
    case 'Approved': return '#22c55e'
    case 'Completed': return '#10b981'
    case 'Rejected': return '#ef4444'
    default: return '#cbd5e1'
  }
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending': return 'secondary'
    case 'Sent': return 'info'
    case 'In Progress': return 'warn'
    case 'Approved': return 'success'
    case 'Completed': return 'success'
    case 'Rejected': return 'danger'
    default: return 'secondary'
  }
}

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
