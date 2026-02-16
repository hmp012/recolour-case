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
              <template v-if="authStore.isManager && data.status === 'Pending'">
                <Button 
                  icon="pi pi-check" 
                  text 
                  rounded 
                  severity="success" 
                  @click="handleApproval(data.id, 'Approved')" 
                  v-tooltip="'Approve Ticket'"
                />
                <Button 
                  icon="pi pi-times" 
                  text 
                  rounded 
                  severity="danger" 
                  @click="handleApproval(data.id, 'Rejected')" 
                  v-tooltip="'Reject Ticket'"
                />
              </template>

              <!-- Transition: Sent -> In Progress -->
              <template v-if="authStore.isManager && data.status === 'Sent'">
                <Button 
                  icon="pi pi-cog" 
                  text 
                  rounded 
                  severity="help" 
                  @click="handleApproval(data.id, 'In Progress')" 
                  v-tooltip="'Mark as In Progress'"
                />
              </template>

              <!-- Transition: In Progress -> Completed -->
              <template v-if="authStore.isManager && data.status === 'In Progress'">
                <Button 
                  icon="pi pi-flag-checkered" 
                  text 
                  rounded 
                  severity="success" 
                  @click="handleApproval(data.id, 'Completed')" 
                  v-tooltip="'Mark as Completed'"
                />
              </template>

              <!-- Requirement 4: Approval & Storage for Completed tickets -->
              <template v-if="authStore.isManager && data.status === 'Completed' && !data.isApproved">
                <Button 
                  icon="pi pi-check-circle" 
                  text 
                  rounded 
                  severity="info" 
                  @click="handleApproval(data.id, 'Completed', true)" 
                  v-tooltip="'Approve to Library'"
                />
                <Button 
                  icon="pi pi-undo" 
                  text 
                  rounded 
                  severity="warning" 
                  @click="handleApproval(data.id, 'Pending', false)" 
                  v-tooltip="'Reject & Return to Queue'"
                />
              </template>

              <!-- Partner Integration: Send to Partner -->
              <template v-if="authStore.isManager && data.status === 'Approved'">
                <Button 
                  icon="pi pi-send" 
                  text 
                  rounded 
                  severity="info" 
                  @click="handleApproval(data.id, 'Sent')" 
                  v-tooltip="data.partner ? 'Send to Partner' : 'Partner required'"
                  :disabled="!data.partner"
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

const handleApproval = async (id, status, isApproved = undefined) => {
  try {
    const updateData = { status }
    if (isApproved !== undefined) {
      updateData.isApproved = isApproved
    }
    
    await ticketService.update(id, updateData)
    
    let summary = 'Status Updated'
    let detail = `Status updated to ${status}`

    if (isApproved === true) {
      summary = 'Photo Approved'
      detail = 'The recoloured photo has been stored in the Approved Library.'
    } else if (status === 'Approved') {
      summary = 'Ticket Approved'
      detail = 'The ticket is ready to be sent to the partner.'
    } else if (status === 'Sent') {
      summary = 'Sent to Partner'
      detail = 'The partner has been notified and the ticket is now "Sent".'
    } else if (status === 'In Progress') {
      summary = 'Ticket In Progress'
      detail = 'The partner has started working on the recolouring.'
    } else if (status === 'Completed' && isApproved === undefined) {
      summary = 'Ticket Completed'
      detail = 'The partner has finished. Awaiting final approval.'
    } else if (status === 'Rejected') {
      summary = 'Ticket Rejected'
    } else if (status === 'Pending' && isApproved === undefined) {
      summary = 'Ticket Returned to Queue'
      detail = 'The ticket has been reset to Pending status.'
    }

    toast.add({
      severity: 'success',
      summary,
      detail,
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
    case 'Approved': return '#22c55e'    // Green-500
    case 'Completed': return '#10b981'   // Emerald-500
    case 'Rejected': return '#ef4444'    // Red-500
    default: return '#cbd5e1'
  }
}

onMounted(() => {
  fetchTickets()
})
</script>
