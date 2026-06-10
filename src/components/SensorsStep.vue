<template>
  <main class="card form-card">
    <h2 class="form-title">{{ t('formTitle4') }}</h2>

    <div class="machinery-row" v-for="item in sensorsList" :key="item.key">
      <label class="machinery-label">{{ t(item.key) }}</label>
      
      <div class="counter-group">
        <button class="counter-btn" @click="decrement(item.key)">-</button>
        <input 
          type="text" 
          class="counter-input" 
          v-model.number="vesselData[item.key]" 
          @input="validateInput(item.key)"
          maxlength="1"
        />
        <button class="counter-btn" @click="increment(item.key)">+</button>
      </div>
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
const props = defineProps(['t', 'vesselData'])
defineEmits(['back', 'next'])

const sensorsList = [
  { key: 'flowmeter' },
  { key: 'shaftMeter' },
  { key: 'powerMeter' },
  { key: 'tempSensor' },
  { key: 'pressSensor' }
]

const increment = (key) => {
  if (props.vesselData[key] < 9) props.vesselData[key]++
}

const decrement = (key) => {
  if (props.vesselData[key] > 0) props.vesselData[key]--
}

const validateInput = (key) => {
  let val = props.vesselData[key]
  if (typeof val !== 'number' || isNaN(val) || val < 0) {
    props.vesselData[key] = 0
  } else if (val > 9) {
    props.vesselData[key] = 9
  }
}
</script>

<style scoped>
/* MachineryStep ile birebir aynı CSS yapısı kararlılık için korunmuştur */
.machinery-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background-color: #232323; padding: 10px 14px; border-radius: 8px; border: 1px solid #2d2d2d; }
.machinery-label { font-size: 0.95rem; color: #ffffff; font-weight: 500; }
.counter-group { display: flex; align-items: center; gap: 8px; }
.counter-btn { background-color: #333333; border: 1px solid #444444; color: #ffffff; width: 32px; height: 32px; border-radius: 6px; font-size: 1.2rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.1s ease; }
.counter-btn:hover { background-color: #444444; border-color: #4fc08d; }
.counter-btn:active { transform: scale(0.95); }
.counter-input { background-color: #1a1a1a; border: 1px solid #3d3d3d; color: #4fc08d; width: 36px; height: 32px; text-align: center; font-size: 1.1rem; font-weight: bold; border-radius: 6px; outline: none; }
.counter-input::-webkit-outer-spin-button, .counter-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
</style>