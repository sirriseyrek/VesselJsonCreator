<template>
  <main class="card form-card">
    <h2 class="form-title">{{ t('formTitle2') }}</h2>

    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="vesselData.dhcp" />
        <span>DHCP</span>
      </label>
    </div>

    <div class="form-group">
      <label>IP Address</label>
      <input 
        type="text" 
        v-model="vesselData.ipAddress" 
        placeholder="192.168.0.230" 
        :disabled="vesselData.dhcp"
        :class="{ 'disabled-input': vesselData.dhcp }"
      />
    </div>

    <div class="form-group">
      <label>Subnet Mask</label>
      <input 
        type="text" 
        v-model="vesselData.subnet" 
        placeholder="255.255.255.0" 
        :disabled="vesselData.dhcp"
        :class="{ 'disabled-input': vesselData.dhcp }"
      />
    </div>

    <div class="form-group">
      <label>{{ t('gatewayIp') }}</label>
      <input 
        type="text" 
        v-model="vesselData.gatewayIp" 
        placeholder="192.168.0.1" 
        :disabled="vesselData.dhcp"
        :class="{ 'disabled-input': vesselData.dhcp }"
      />
    </div>

    <div class="form-group">
      <label>{{ t('installDate') }}</label>
      <input type="date" v-model="vesselData.installDate" />
    </div>

    <div class="wizard-actions dual-buttons">
      <button class="back-btn" @click="$emit('back')">{{ t('backBtn') }}</button>
      <button class="action-btn" @click="$emit('next')">
        {{ t('nextBtn') }}
      </button>
    </div>
  </main>
</template>

<script setup>
defineProps(['t', 'vesselData'])
defineEmits(['back', 'next'])
</script>

<style scoped>
/* Checkbox Tasarımı */
.checkbox-group {
  margin-bottom: 20px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
}
.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4fc08d; /* Dark temaya uygun yeşil check rengi */
}

/* Pasif Duruma Geçen Kutuların Stili */
.disabled-input {
  background-color: #1a1a1a !important;
  border-color: #252525 !important;
  color: #555555 !important;
  cursor: not-allowed;
}
</style>