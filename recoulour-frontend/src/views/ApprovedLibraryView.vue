<template>
  <div :style="{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }">
    <!-- Header Section -->
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }">
      <div>
        <h1 :style="{ margin: 0, fontSize: '1.875rem', color: 'white' }">Approved Photos</h1>
        <p :style="{ margin: '0.25rem 0 0 0', color: '#94a3b8' }">Library of all finalized and approved recolouring results</p>
      </div>
      <div :style="{ display: 'flex', gap: '1rem' }">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search by style or ref..." :style="{ borderRadius: '8px' }" />
        </IconField>
        <Button 
          icon="pi pi-refresh" 
          @click="fetchApprovedPhotos" 
          :loading="loading" 
          rounded 
          outlined 
          severity="secondary" 
        />
      </div>
    </div>

    <!-- Gallery Grid -->
    <div v-if="loading" :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }">
      <div v-for="i in 6" :key="i" :style="{ height: '350px', backgroundColor: '#1e293b', borderRadius: '12px', animation: 'pulse 2s infinite' }"></div>
    </div>

    <div v-else-if="filteredPhotos.length === 0" :style="{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#64748b' }">
      <i class="pi pi-images" :style="{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }"></i>
      <span :style="{ fontSize: '1.25rem', fontWeight: '500' }">No approved photos found</span>
      <p :style="{ marginTop: '0.5rem' }">Tickets must be marked as Completed and Approved to appear here.</p>
    </div>

    <div v-else :style="{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '1.5rem',
      overflowY: 'auto',
      paddingBottom: '2rem'
    }">
      <div 
        v-for="asset in filteredPhotos" 
        :key="asset.id"
        class="photo-card"
        :style="{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          border: '1px solid #334155'
        }"
      >
        <!-- Image Container -->
        <div :style="{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#0f172a' }">
          <img 
            :src="getImageUrl(asset.filePath)" 
            :alt="asset.ticket?.style"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }"
            @error="onImageError"
          />
          <div v-if="asset.ticket?.priority" :style="{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
          }">
            <Tag :value="asset.ticket.priority" :severity="getPrioritySeverity(asset.ticket.priority)" />
          </div>
        </div>

        <!-- Content -->
        <div :style="{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }">
            <h3 :style="{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: '600' }">{{ asset.ticket?.style || 'Untitled Style' }}</h3>
            <span v-if="asset.ticket?.referenceCode" :style="{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }">#{{ asset.ticket.referenceCode }}</span>
          </div>
          
          <div :style="{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }">
            <div :style="{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }">
              <i class="pi pi-palette" :style="{ fontSize: '0.8rem' }"></i>
              {{ asset.ticket?.targetColor || 'Original' }}
            </div>
            <div v-if="asset.ticket?.partner" :style="{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }">
              <i class="pi pi-building" :style="{ fontSize: '0.8rem' }"></i>
              {{ asset.ticket.partner }}
            </div>
          </div>

          <div :style="{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
             <Button icon="pi pi-download" label="Download" size="small" text severity="secondary" @click.stop="downloadImage(asset)" />
             <Button icon="pi pi-external-link" size="small" text rounded severity="secondary" @click.stop="viewFullScreen(asset)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { assetService } from '@/services/assetService'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const approvedAssets = ref([])
const loading = ref(false)
const searchQuery = ref('')

const fetchApprovedPhotos = async () => {
  loading.value = true
  try {
    const response = await assetService.getAll({ type: 'Recoloured', isApproved: true })
    approvedAssets.value = response.data
  } catch (error) {
    console.error('Failed to fetch approved photos:', error)
  } finally {
    loading.value = false
  }
}

const filteredPhotos = computed(() => {
  if (!searchQuery.value) return approvedAssets.value
  
  const query = searchQuery.value.toLowerCase()
  return approvedAssets.value.filter(asset => 
    asset.ticket?.style?.toLowerCase().includes(query) || 
    asset.ticket?.referenceCode?.toLowerCase().includes(query) ||
    asset.ticket?.partner?.toLowerCase().includes(query)
  )
})

const getImageUrl = (filePath) => {
  if (!filePath) return ''
  
  // Simulation: use original path if it's a simulated recoloured one
  let cleanPath = filePath.replace('_recoloured', '')
  
  // Handle path: if it starts with 'recolour-case/', remove it since it's served from that root
  cleanPath = cleanPath.startsWith('recolour-case/') 
    ? cleanPath.replace('recolour-case/', '') 
    : cleanPath
  
  return `http://localhost:3000/assets-storage/${cleanPath}`
}

const onImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Image+Not+Found'
}

const getPrioritySeverity = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'danger'
    case 'medium': return 'warn'
    case 'low': return 'info'
    default: return 'secondary'
  }
}

const downloadImage = (asset) => {
  const url = getImageUrl(asset.filePath)
  const link = document.createElement('a')
  link.href = url
  link.download = `${asset.ticket?.referenceCode || 'asset'}_${asset.ticket?.style || 'recoloured'}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const viewFullScreen = (asset) => {
  const url = getImageUrl(asset.filePath)
  window.open(url, '_blank')
}

onMounted(() => {
  fetchApprovedPhotos()
})
</script>

<style scoped>
.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  border-color: #475569 !important;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

