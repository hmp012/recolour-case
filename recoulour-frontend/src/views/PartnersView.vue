<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }">
    <!-- Header -->
    <div :style="{ flexShrink: 0 }">
      <h1 :style="{ margin: 0, fontSize: '1.875rem', color: 'white' }">Partner Overview</h1>
      <p :style="{ margin: '0.25rem 0 0 0', color: '#94a3b8' }">Monitor workload and ticket status across all active partners</p>
    </div>

    <!-- Partner Cards Grid -->
    <div :style="{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
      gap: '1.5rem',
      flex: 1,
      overflowY: 'auto',
      paddingBottom: '2rem'
    }">
      <div 
        v-for="partner in partnerStats" 
        :key="partner.name"
        :style="{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }"
      >
        <!-- Partner Name & Header -->
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }">
          <div>
            <h2 :style="{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }">{{ partner.name }}</h2>
            <div :style="{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }">
              Total Managed: {{ partner.total }}
            </div>
          </div>
          <!-- <div :style="{ 
            backgroundColor: '#334155', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '8px',
            textAlign: 'center'
          }">
            <div :style="{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }">Efficiency</div>
            <div :style="{ fontSize: '1.125rem', fontWeight: 'bold', color: '#10b981' }">94%</div>
          </div> -->
        </div>

        <!-- KPI Row -->
        <div :style="{ display: 'flex', gap: '1rem' }">
          <div :style="{ flex: 1, backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', textAlign: 'center' }">
            <div :style="{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6366f1' }">{{ partner.approved }}</div>
            <div :style="{ fontSize: '0.75rem', color: '#94a3b8' }">Approved</div>
          </div>
          <div :style="{ flex: 1, backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', textAlign: 'center' }">
            <div :style="{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }">{{ partner.completed }}</div>
            <div :style="{ fontSize: '0.75rem', color: '#94a3b8' }">Completed</div>
          </div>
        </div>

        <!-- Recent Tickets List -->
        <div>
          <div :style="{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }">
            <i class="pi pi-history"></i>
            Recent Activity
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
            <div 
              v-for="ticket in partner.recentTickets" 
              :key="ticket.id"
              :style="{ 
                backgroundColor: '#334155', 
                padding: '0.6rem 0.8rem', 
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }"
            >
              <div :style="{ display: 'flex', flexDirection: 'column' }">
                <span :style="{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: '500' }">#{{ ticket.referenceCode }}</span>
                <span :style="{ fontSize: '0.75rem', color: '#94a3b8' }">{{ ticket.style }}</span>
              </div>
              <Tag :value="ticket.status" :severity="getStatusSeverity(ticket.status)" :style="{ fontSize: '0.7rem' }" />
            </div>
            <div v-if="partner.recentTickets.length === 0" :style="{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.875rem', fontStyle: 'italic' }">
              No active tickets for this partner.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ticketService } from '@/services/ticketService'
import Tag from 'primevue/tag'

const tickets = ref([])
const partners = ['Studio Pro', 'FastColor AI', 'Visual Arts HK', 'Elite Retouch']
const partnerStats = ref([])

const fetchStats = async () => {
  try {
    const response = await ticketService.getAll()
    tickets.value = response.data
    
    partnerStats.value = partners.map(name => {
      // Full list for the "Recent Activity" section
      const partnerTickets = tickets.value.filter(t => t.partner === name)
      
      return {
        name,
        total: partnerTickets.length,
        // Exclusive counts for the KPI section
        approved: partnerTickets.filter(t => t.status === 'Approved').length,
        completed: partnerTickets.filter(t => t.status === 'Completed').length,
        recentTickets: partnerTickets.slice(0, 3)
      }
    })
  } catch (error) {
    console.error('Failed to fetch partner stats:', error)
  }
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending': return 'info'
    case 'Sent': return 'help'
    case 'In Progress': return 'warn'
    case 'Approved': return 'success'
    case 'Completed': return 'success'
    case 'Rejected': return 'danger'
    default: return 'secondary'
  }
}

onMounted(() => {
  fetchStats()
})
</script>
