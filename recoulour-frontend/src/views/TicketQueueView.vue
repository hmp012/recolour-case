<template>
  <div :style="{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }">
    <!-- Header Section -->
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }">
      <div>
        <h1 :style="{ margin: 0, fontSize: '1.875rem', color: 'white' }">Ticket Queue</h1>
        <p :style="{ margin: '0.25rem 0 0 0', color: '#94a3b8' }">Manage and monitor all active recolouring requests</p>
      </div>
      <div :style="{ display: 'flex', gap: '1rem' }">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Search tickets..." :style="{ borderRadius: '8px' }" />
        </IconField>
        <Button 
          icon="pi pi-refresh" 
          @click="fetchTickets" 
          :loading="loading" 
          rounded 
          outlined 
          severity="secondary" 
        />
      </div>
    </div>

    <!-- Main Table Card -->
    <div :style="{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px', 
      overflow: 'hidden'
    }">
      <DataTable 
        :value="tickets" 
        :loading="loading" 
        paginator 
        :rows="10" 
        dataKey="id" 
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['referenceCode', 'style', 'status', 'priority']"
        stripedRows
        removableSort
        responsiveLayout="scroll"
        scrollable
        scrollHeight="flex"
        :style="{ flex: 1, display: 'flex', flexDirection: 'column' }"
        :pt="{
          header: { style: { border: 'none' } },
          wrapper: { style: { flex: '1 1 auto', display: 'flex', flexDirection: 'column' } },
          table: { style: { flex: '1 1 auto' } },
          tbody: { style: { flex: '1 1 auto' } }
        }"
      >
        <template #empty>
          <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#64748b', minHeight: '300px' }">
            <i class="pi pi-inbox" :style="{ fontSize: '3rem', marginBottom: '1rem' }"></i>
            <span :style="{ fontSize: '1.2rem', fontWeight: '500' }">No tickets found</span>
          </div>
        </template>

        <Column field="referenceCode" header="Reference" sortable :style="{ fontWeight: '600', color: '#334155' }">
          <template #body="{ data }">
            #{{ data.referenceCode }}
          </template>
        </Column>

        <Column field="style" header="Style" sortable></Column>

        <Column field="priority" header="Priority" sortable :style="{ width: '150px' }">
          <template #body="{ data }">
            <Tag :value="data.priority" :severity="getPrioritySeverity(data.priority)" :style="{ borderRadius: '6px', padding: '0.25rem 0.6rem' }" />
          </template>
        </Column>

        <Column field="status" header="Status" sortable :style="{ width: '180px' }">
          <template #body="{ data }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem' }">
              <div :style="{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(data.status) }"></div>
              <span :style="{ fontWeight: '500' }">{{ data.status }}</span>
            </div>
          </template>
        </Column>

        <Column header="Actions" :style="{ width: '100px', textAlign: 'center' }">
          <template #body="{ data }">
            <Button icon="pi pi-chevron-right" text rounded severity="secondary" @click="viewDetails(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { ticketService } from '@/services/ticketService'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const tickets = ref([])
const loading = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  priority: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const fetchTickets = async () => {
  loading.value = true
  try {
    const response = await ticketService.getAll()
    tickets.value = response.data
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}

const getPrioritySeverity = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'danger'
    case 'medium': return 'warn'
    case 'low': return 'info'
    default: return 'secondary'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#94a3b8' // Slate-400
    case 'Sent': return '#6366f1'    // Indigo-500
    case 'In Progress': return '#f59e0b' // Amber-500
    case 'Completed': return '#10b981'   // Emerald-500
    case 'Rejected': return '#ef4444'    // Red-500
    default: return '#cbd5e1'
  }
}

const viewDetails = (ticket) => {
  console.log('Navigate to ticket details:', ticket.id)
}

onMounted(() => {
  fetchTickets()
})
</script>
