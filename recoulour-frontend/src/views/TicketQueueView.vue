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
        :pt="{
          header: { style: { border: 'none' } },
          wrapper: { style: { display: 'flex', flexDirection: 'column' } },
          thead: { style: { height: '3rem' } },
          headerCell: { style: { padding: '0.5rem 1rem' } },
          bodyCell: { style: { padding: '0.5rem 1rem' } }
        }"
      >
        <template #empty>
          <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#64748b', minHeight: '300px' }">
            <i class="pi pi-inbox" :style="{ fontSize: '3rem', marginBottom: '1rem' }"></i>
            <span :style="{ fontSize: '1.2rem', fontWeight: '500' }">No tickets found</span>
          </div>
        </template>

        <Column field="referenceCode" header="Reference" sortable :style="{ fontWeight: '600', color: '#f8fafc', width: '120px' }">
          <template #body="{ data }">
            #{{ data.referenceCode }}
          </template>
        </Column>

        <Column field="style" header="Style" sortable :style="{ color: '#f8fafc' }"></Column>

        <Column field="targetColor" header="Target Color" sortable :style="{ color: '#f8fafc', width: '180px' }"></Column>

        <Column field="partner" header="Partner" sortable :style="{ color: '#f8fafc', width: '180px' }"></Column>

        <Column field="priority" header="Priority" sortable :style="{ width: '120px' }">
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

        <Column v-if="authStore.isManager" header="Actions" :style="{ width: '150px', textAlign: 'center' }">
          <template #body="{ data }">
            <div :style="{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }">
              <Button icon="pi pi-eye" text rounded severity="secondary" @click="viewDetails(data)" :style="{ color: '#94a3b8' }" />
              
              <template v-if="authStore.isManager && data.status === 'Pending'">
                <Button 
                  icon="pi pi-check" 
                  text 
                  rounded 
                  severity="success" 
                  @click="handleApproval(data.id, 'Completed')" 
                />
                <Button 
                  icon="pi pi-times" 
                  text 
                  rounded 
                  severity="danger" 
                  @click="handleApproval(data.id, 'Rejected')" 
                />
              </template>
            </div>
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
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'primevue/usetoast'

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
const authStore = useAuthStore()
const toast = useToast()

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

const handleApproval = async (id, status) => {
  try {
    await ticketService.update(id, { status })
    toast.add({
      severity: 'success',
      summary: status === 'Completed' ? 'Ticket Accepted' : 'Ticket Rejected',
      detail: `Status updated to ${status}`,
      life: 3000
    })
    fetchTickets()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update ticket status',
      life: 5000
    })
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
