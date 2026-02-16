<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }">
    <!-- Header -->
    <div :style="{ flexShrink: 0 }">
      <h1 :style="{ margin: 0, fontSize: '1.875rem' }">Create Recolour Ticket</h1>
      <p :style="{ margin: '0.25rem 0 0 0', color: '#94a3b8' }">Submit a new photo for professional recolouring</p>
    </div>

    <!-- Main Content -->
    <div :style="{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }">
      
      <!-- Left: Asset Selection -->
      <div :style="{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#1e293b', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid #334155'
      }">
        <h3 :style="{ margin: '0 0 1rem 0', fontSize: '1.25rem' }">1. Select Photo</h3>
        <div :style="{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '1rem',
          padding: '0.5rem'
        }">
          <div 
            v-for="asset in assets" 
            :key="asset.id"
            @click="toggleAsset(asset)"
            @mouseenter="hoveredAsset = asset"
            @mouseleave="hoveredAsset = null"
            :style="{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: isSelected(asset) ? '3px solid #6366f1' : '1px solid #334155',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }"
          >
            <img 
              :src="getAssetUrl(asset.filePath)" 
              :style="{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }"
            />
            
            <!-- Selection Checkmark -->
            <div v-if="isSelected(asset)" :style="{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#6366f1',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }">
              <i class="pi pi-check" :style="{ fontSize: '12px', color: 'white' }"></i>
            </div>

            <!-- Hover Preview Overlay -->
            <div 
              v-if="hoveredAsset?.id === asset.id"
              :style="{
                position: 'fixed',
                bottom: '2rem',
                left: '20rem',
                width: '400px',
                height: '400px',
                backgroundColor: '#ffffff',
                border: '2px solid #6366f1',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                padding: '1rem',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }"
            >
              <img 
                :src="getAssetUrl(asset.filePath)" 
                :style="{ width: '100%', height: 'calc(100% - 20px)', objectFit: 'contain' }"
              />
              <div :style="{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }">{{ asset.filePath.split('/').pop() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Form Details -->
      <div :style="{ 
        width: '400px', 
        backgroundColor: '#1e293b', 
        borderRadius: '12px', 
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        border: '1px solid #334155',
        position: 'sticky',
        top: '.1rem',
        bottom: '.4rem'
      }">
        <h3 :style="{ margin: 0, fontSize: '1.25rem' }">2. Ticket Details</h3>
        
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
          <label :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Style Name</label>
          <InputText v-model="form.style" placeholder="e.g. Summer Floral Dress" :style="{ width: '100%' }" />
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
          <label :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Target Color</label>
          <InputText v-model="form.targetColor" placeholder="e.g. Royal Blue" :style="{ width: '100%' }" />
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
          <label :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Priority</label>
          <Select v-model="form.priority" :options="priorities" placeholder="Select Priority" :style="{ width: '100%' }" />
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
          <label :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Partner</label>
          <Select v-model="form.partner" :options="partners" placeholder="Select Partner" :style="{ width: '100%' }" />
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
          <label :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Reference Code (Optional)</label>
          <InputText v-model="form.referenceCode" placeholder="Internal ID" :style="{ width: '100%' }" />
        </div>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '1rem' }">
          <div v-if="selectedAssets.length > 0" :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
            <div :style="{ fontSize: '0.875rem', color: '#94a3b8' }">Selected Photos ({{ selectedAssets.length }})</div>
            <div 
              v-for="asset in selectedAssets" 
              :key="asset.id"
              :style="{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: '#334155', borderRadius: '8px' }"
            >
              <img :src="getAssetUrl(asset.filePath)" :style="{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }" />
              <div :style="{ overflow: 'hidden', flex: 1 }">
                <div :style="{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ asset.filePath.split('/').pop() }}</div>
              </div>
              <Button 
                icon="pi pi-times" 
                severity="secondary" 
                text 
                rounded 
                @click="toggleAsset(asset)" 
                :style="{ width: '1.5rem', height: '1.5rem' }"
              />
            </div>
          </div>
          
          <Button 
            label="Create Ticket" 
            icon="pi pi-plus" 
            :loading="submitting" 
            @click="submitTicket" 
            :disabled="!isFormValid"
            :style="{ width: '100%', height: '3rem', fontSize: '1.1rem' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { assetService } from '@/services/assetService'
import { ticketService } from '@/services/ticketService'
import { useToast } from 'primevue/usetoast'

import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()

const assets = ref([])
const selectedAssets = ref([])
const hoveredAsset = ref(null)
const submitting = ref(false)

const priorities = ['Low', 'Medium', 'High']
const partners = ['Studio Pro', 'FastColor AI', 'Visual Arts HK', 'Elite Retouch']

const form = ref({
  style: '',
  targetColor: '',
  priority: 'Medium',
  partner: '',
  referenceCode: ''
})

const isFormValid = computed(() => {
  return selectedAssets.value.length > 0 && form.value.style.trim() && form.value.targetColor.trim() && form.value.partner
})

const toggleAsset = (asset) => {
  const index = selectedAssets.value.findIndex(a => a.id === asset.id)
  if (index === -1) {
    selectedAssets.value.push(asset)
  } else {
    selectedAssets.value.splice(index, 1)
  }
}

const isSelected = (asset) => {
  return selectedAssets.value.some(a => a.id === asset.id)
}

const fetchAssets = async () => {
  try {
    const response = await assetService.getAll()
    assets.value = response.data.filter(a => a.type === 'Original')
  } catch (error) {
    console.error('Failed to fetch assets:', error)
  }
}

const getAssetUrl = (filePath) => {
  // filePath in DB is "recolour-case/Ticket 1/file.jpg"
  // The static route /assets-storage maps to the "recolour-case" folder
  // So we need to remove the "recolour-case/" prefix from the path
  const cleanPath = filePath.replace('recolour-case/', '')
  return `http://localhost:3000/assets-storage/${cleanPath}`
}

const submitTicket = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  try {
    const payload = {
      ...form.value,
      baseAssetIds: selectedAssets.value.map(a => a.id),
      // If referenceCode is empty, maybe generate one or let backend handle it
      referenceCode: form.value.referenceCode || `REC-${Math.floor(Math.random() * 10000)}`
    }
    
    await ticketService.create(payload)
    
    toast.add({
      severity: 'success',
      summary: 'Ticket Created',
      detail: 'The recolour request has been added to the queue.',
      life: 3000
    })
    
    setTimeout(() => {
      router.push('/queue')
    }, 1000)
    
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create ticket. Please try again.',
      life: 5000
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchAssets()
})
</script>
