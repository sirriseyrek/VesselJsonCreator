<template>
  <main class="card form-card">
    <h2 class="form-title">{{ t('formTitle1') }}</h2>
    
    <div class="form-group">
      <label>{{ t('vesselName') }}</label>
      <input 
        type="text" 
        :value="vesselData.vesselName" 
        @input="updateName"
        :placeholder="t('vesselName')"
      />
    </div>

    <div class="form-group">
      <label>{{ t('imoNumber') }}</label>
      <input type="text" v-model="vesselData.imoNumber" placeholder="Ex: 9123456" />
    </div>

    <div class="form-group">
      <label>{{ t('createdBy') }}</label>
      <input type="text" v-model="vesselData.createdBy" placeholder="John Doe" />
    </div>
    <div class="form-group">
      <label>{{ t('fuel1') || 'Fuel Type 1' }}</label>
      <select v-model="vesselData.fuel1" class="form-select">
        <option value="">None</option>
        <option v-for="fuel in fuelsList" :key="fuel.id" :value="fuel.id">
          {{ fuel.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>{{ t('fuel2') || 'Fuel Type 2' }}</label>
      <select v-model="vesselData.fuel2" class="form-select">
        <option value="">None</option>
        <option v-for="fuel in fuelsList" :key="fuel.id" :value="fuel.id">
          {{ fuel.name }}
        </option>
      </select>
    </div>
    <div class="wizard-actions">
      <button class="action-btn" @click="$emit('next')" :disabled="!vesselData.vesselName">
        {{ t('nextBtn') }}
      </button>
    </div>
  </main>
</template>

<script setup>
const props = defineProps(['t', 'vesselData', 'fuelsList'])
const emit = defineEmits(['next'])

const updateName = (e) => {
  props.vesselData.vesselName = e.target.value.toUpperCase()
}
</script>
<style scoped>
/* Combobox Dark Tema Tasarımı */
.form-select {
  background-color: #252525;
  border: 1px solid #3d3d3d;
  border-radius: 6px;
  padding: 12px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.form-select:focus {
  border-color: #4fc08d;
}
</style>