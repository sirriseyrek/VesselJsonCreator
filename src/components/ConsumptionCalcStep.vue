<template>
  <main class="card calc-card">
    <h2 class="form-title">{{ t('formTitle5') || 'Consumption Calculations' }}</h2>

    <div class="fm-grid">
      <div v-for="fm in vesselData.flowmetersList" :key="fm.id" class="fm-box" :class="fm.fuelType.toLowerCase()">
        <div class="fm-icon-wrapper">
    <svg class="fm-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 9h2v6H2z" />
        <path d="M4 12h4" />
        <path d="M20 9h2v6h-2z" />
        <path d="M16 12h4" />
        <circle cx="12" cy="12" r="5" />
        <rect x="10" y="10.5" width="4" height="1.5" rx="0.3" />
        <circle cx="10.5" cy="14" r="0.4" fill="currentColor" />
        <circle cx="12" cy="14" r="0.4" fill="currentColor" />
        <circle cx="13.5" cy="14" r="0.4" />
    </svg>
    <span class="fm-name-label">{{ fm.name }}</span>
    </div>
            
        <select v-model="fm.fuelType" class="fm-select-mini">
          <option value="None">None</option>
          <option value="Fuel1">Fuel 1</option>
          <option value="Fuel2">Fuel 2</option>
          <option value="Both">Both</option>
        </select>
      </div>
    </div>

    <div class="operator-bar">
        <div class="op-group row-operators">
            <button v-for="op in ['+', '-', '(', ')']" :key="op" class="op-btn" @click="appendToken(op)">{{ op }}</button>
        </div>
        
        <div class="op-group row-flowmeters">
            <button v-for="fm in vesselData.flowmetersList" :key="fm.id" class="op-btn fm-token" @click="appendToken(fm.id)">
            {{ fm.name }}
            </button>
        </div>
        
        <div class="op-group row-actions">
            <button class="op-btn backspace-btn" @click="deleteLastChar" title="Delete Last">⌫</button>
            <button class="op-btn clear-btn" @click="clearActiveFormula" title="Clear All">C</button>
        </div>
    </div>

    <div class="calc-rows">
      <div v-for="mach in ['mainEngine', 'generators', 'boiler']" :key="mach" class="calc-row-group">
        <label>{{ t(mach) }} Formula</label>
        <input 
          type="text" 
          v-model="vesselData.calculations[mach]" 
          @focus="activeInput = mach"
          placeholder="e.g. fm1-(fm2+fm3)"
          class="formula-input"
        />
      </div>
    </div>

    <div class="wizard-actions dual-buttons">
      <button class="back-btn" @click="$emit('back')">{{ t('backBtn') }}</button>
      <button class="action-btn" @click="$emit('next')">{{ t('finishBtn') }}</button>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['t', 'vesselData'])
defineEmits(['back', 'next'])

const activeInput = ref('mainEngine') // O an odaklanılan formül kutusu

// Seçili olan makine kutusuna butona basılan token'ı yazar
const appendToken = (token) => {
  if (!activeInput.value) return
  props.vesselData.calculations[activeInput.value] += token
}

const clearActiveFormula = () => {
  if (!activeInput.value) return
  props.vesselData.calculations[activeInput.value] = ''
}
const deleteLastChar = () => {
  if (!activeInput.value) return
  const currentFormula = props.vesselData.calculations[activeInput.value]
  
  if (!currentFormula) return

  // Eğer formülün sonu bir fm token'ı ile bitiyoralsa (Örn: fm1, fm12) komple siler
  const match = currentFormula.match(/fm\d+$/)
  if (match) {
    props.vesselData.calculations[activeInput.value] = currentFormula.substring(0, match.index)
  } else {
    // Normal tek karakterlik (+, -, (, )) silme işlemi
    props.vesselData.calculations[activeInput.value] = currentFormula.slice(0, -1)
  }
}
</script>

<style scoped>
.calc-card { max-width: 550px !important; } /* Formüller için kutuyu hafif genişlettik */

/* Flowmeter Kart Tasarımları */
.fm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-bottom: 20px; }
.fm-box { background-color: #232323; border: 1px solid #3d3d3d; border-radius: 8px; padding: 10px; text-align: center; transition: border-color 0.2s; }
.fm-icon { font-size: 0.9rem; font-weight: bold; margin-bottom: 6px; color: #aaa; }

/* Aktif yakıt tiplerine göre endüstriyel renk kodları */
.none { border-left: 4px solid #555; }
.fuel1 { border-left: 4px solid #00bcff; }
.fuel2 { border-left: 4px solid #ffaa00; }
.both { border-left: 4px solid #4fc08d; }

.fm-select-mini { background-color: #1a1a1a; border: 1px solid #444; color: #fff; font-size: 0.8rem; border-radius: 4px; padding: 2px 4px; width: 100%; outline: none; cursor: pointer; }

/* Operatör Paneli */
.operator-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #1a1a1a;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #2d2d2d;
}

/* İç Buton Gruplarının Esnek Hizalaması */
.op-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Flowmetre butonlarının alt alta geldiğinde de hizalı durmasını sağlayan grid yapısı */
.row-flowmeters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  width: 100%;
}

/* Genel Buton Tasarımları */
.op-btn {
  background-color: #2a2a2a;
  border: 1px solid #3d3d3d;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  user-select: none;
  transition: all 0.15s ease;
}

.op-btn:hover {
  background-color: #383838;
  border-color: #4fc08d;
}

/* Flowmeter Butonları */
.fm-token {
  background-color: #1e2925;
  color: #4fc08d;
  border-color: rgba(79, 192, 141, 0.3);
}
.fm-token:hover {
  background-color: #273e35;
  border-color: #4fc08d;
}

/* Aksiyon Butonları Renklendirmesi */
.row-actions {
  justify-content: flex-end; /* Silme butonlarını sağ tarafa yaslar */
  border-top: 1px solid #2d2d2d;
  padding-top: 10px;
  margin-top: 4px;
}

.backspace-btn {
  background-color: #b06000;
  border-color: #c77c1e;
  min-width: 45px;
}
.backspace-btn:hover {
  background-color: #ca7206;
}

.clear-btn {
  background-color: #901a1a;
  border-color: #a82a2a;
  min-width: 45px;
}
.clear-btn:hover {
  background-color: #b02020;
}
/* Hesaplama Satırları */
.calc-rows { display: flex; flex-direction: column; gap: 14px; }
.calc-row-group { display: flex; flex-direction: column; gap: 6px; }
.calc-row-group label { font-size: 0.85rem; color: #aaa; text-transform: capitalize; }
.formula-input { background-color: #252525; border: 1px solid #3d3d3d; border-radius: 6px; padding: 12px; color: #fff; font-size: 1.1rem; font-family: monospace; letter-spacing: 1px; outline: none; width: 100%; box-sizing: border-box; }
.formula-input:focus { border-color: #4fc08d; background-color: #2a2a2a; }
/* Flowmeter Kutu İçi Yerleşimi */
.fm-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

/* SVG İkonunun Temel Boyutu ve Rengi */
.fm-svg {
  width: 42px;
  height: 42px;
  color: #888888; /* Varsayılan None durumu rengi */
  transition: color 0.2s ease, transform 0.2s ease;
}

.fm-name-label {
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: #ffffff;
}

/* Yakıt Tiplerine Göre SVG İkonunun Dinamik Renk Alması */
.none .fm-svg {
  color: #666666;
}

.fuel1 .fm-svg {
  color: #00bcff; /* Fuel 1: Canlı Mavi */
  filter: drop-shadow(0 0 4px rgba(0, 188, 255, 0.2));
}

.fuel2 .fm-svg {
  color: #ffaa00; /* Fuel 2: Endüstriyel Turuncu */
  filter: drop-shadow(0 0 4px rgba(255, 170, 0, 0.2));
}

.both .fm-svg {
  color: #4fc08d; /* Both: Vue Yeşili */
  filter: drop-shadow(0 0 4px rgba(79, 192, 141, 0.2));
}

/* Kutuya Hover Olunduğunda Hafif Büyüme Efekti */
.fm-box:hover .fm-svg {
  transform: scale(1.05);
}
</style>