<template>
  <div class="app-container">
    
    <TopBar 
      :currentLang="currentLang" 
      :isReadyToExport="isReadyToExport"
      @import="triggerImport"
      @export="exportJson"
      @toggle-lang="toggleLanguage"
    />

    <WelcomeStep v-if="step === 1" :t="t" @next="step = 2" />
    
    <IdentityStep v-if="step === 2" :t="t" :vesselData="vesselData" :fuelsList="fuelsList" @next="step = 3" />
    
    <NetworkStep 
      v-if="step === 3" 
      :t="t" 
      :vesselData="vesselData" 
      @back="step = 2" 
      @next="step = 4" 
    />

    <MachineryStep 
      v-if="step === 4" 
      :t="t" 
      :vesselData="vesselData" 
      @back="step = 3" 
      @next="step = 5" 
      />

    <SensorsStep 
      v-if="step === 5" 
      :t="t" 
      :vesselData="vesselData" 
      @back="step = 4" 
      @next="generateFlowmetersAndGo" 
    />

    <ConsumptionCalcStep
      v-if="step === 6"
      :t="t"
      :vesselData="vesselData"
      @back="step = 5"
      @next="saveFullConfig"
    />
    <ToastMessage :message="statusMessage" />

    <input type="file" ref="fileInput" accept=".json" @change="importJson" style="display: none;" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Bileşenleri İçeri Aktarma
import TopBar from './components/TopBar.vue'
import WelcomeStep from './components/WelcomeStep.vue'
import IdentityStep from './components/IdentityStep.vue'
import NetworkStep from './components/NetworkStep.vue'
import MachineryStep from './components/MachineryStep.vue'
import SensorsStep from './components/SensorsStep.vue'
import ConsumptionCalcStep from './components/ConsumptionCalcStep.vue'
import ToastMessage from './components/ToastMessage.vue'

const currentLang = ref('TR')
const step = ref(1)
const fileInput = ref(null)
const statusMessage = ref('')
const isWizardFinished = ref(false)
const fuelsList = [
  { id: "Hfo", name: "Hfo", threshold: 135, co2: 3.114, lhv: 40500, lcvShop: 40500 },
  { id: "Hsfo", name: "Hsfo", threshold: 120, co2: 3.114, lhv: 40200, lcvShop: 40200 },
  { id: "Lsfo", name: "Lsfo", threshold: 80, co2: 3.151, lhv: 41000, lcvShop: 41000 },
  { id: "Mdo", name: "Mdo", threshold: 45, co2: 3.206, lhv: 42700, lcvShop: 42700 },
  { id: "Lng", name: "Lng", threshold: 20, co2: 2.750, lhv: 50000, lcvShop: 50000 },
  { id: "Lpg", name: "Lpg", threshold: 35, co2: 3.000, lhv: 46000, lcvShop: 46000 },
  { id: "Mnol", name: "Mnol", threshold: 35, co2: 1.375, lhv: 19900, lcvShop: 19900 }
]

// Tüm adımları ve machinery datalarını içeren merkezi veri modeli
const vesselData = reactive({
  vesselName: '', imoNumber: '', createdBy: '', fuel1: '', fuel2: '',
  gatewayIp: '', installDate: '', dhcp: false, ipAddress: '', subnet: '',
  mainEngine: 0, generators: 0, boiler: 0, shaftGen: 0, turbineGen: 0,
  flowmeter: 0, shaftMeter: 0, powerMeter: 0, tempSensor: 0, pressSensor: 0,
  flowmetersList: [], calculations: {mainEngine: '', generators: '', boiler: ''}
})

const isReadyToExport = computed(() => isWizardFinished.value && vesselData.vesselName.trim() !== '')

onMounted(() => {
  // Önce kaydedilmiş dil tercihini yükle
  const savedLang = localStorage.getItem('vessel_app_lang')
  if (savedLang) {
    currentLang.value = savedLang
  }

  // Sonra form verilerini yükle
  const savedData = localStorage.getItem('vessel_settings_cache')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      Object.assign(vesselData, parsed)
      
      if (vesselData.vesselName) {
        step.value = 2
        isWizardFinished.value = true
      }
    } catch (e) {
      console.error("Hafıza okuma hatası:", e)
    }
  }
})
const generateFlowmetersAndGo = () => {
  const count = vesselData.flowmeter || 0
  
  // Eğer daha önce import edilmemişse veya adet değiştiyse listeyi sıfırdan güvenli oluştur
  if (vesselData.flowmetersList.length !== count) {
    vesselData.flowmetersList = Array.from({ length: count }, (_, i) => ({
      id: `fm${i + 1}`,
      name: `FM${i + 1}`,
      fuelType: 'None' // None, Fuel1, Fuel2, Both
    }))
  }
  
  step.value = 6 // Hesaplama sayfasına geç
}

// Sihirbazın sonundaki Next butonuna basılınca çalışan nihai kaydetme fonksiyonu
const saveFullConfig = () => {
  localStorage.setItem('vessel_settings_cache', JSON.stringify(vesselData))
  isWizardFinished.value = true
  showStatus(t('successFinish'))
}

const translations = {
  TR: {
    welcome: 'Merhaba', startBtn: 'Oluşturmaya Başla', nextBtn: 'Sonraki', backBtn: 'Geri', finishBtn: 'Tamamla',
    formTitle1: 'Gemi Kimlik Bilgileri', formTitle2: 'Sistem ve Ağ Ayarları', formTitle3: 'Makine Dairesi Ekipmanları',formTitle4: 'Sensörler',
    vesselName: 'Gemi İsmi', imoNumber: 'IMO Numarası', createdBy: 'Oluşturan', fuel1: 'Yakıt Tip 1', fuel2: 'Yakıt Tip 2',
    gatewayIp: 'Gateway IP', installDate: 'Kurulum Tarihi',
    mainEngine: 'Ana Makine', generators: 'Jeneratörler', boiler: 'Kazan', shaftGen: 'Şaft Jeneratörü', turbineGen: 'Türbin Jeneratörü',
    flowmeter: 'FlowMetre', shaftMeter: 'ShaftMetre', powerMeter: 'KwMetre', tempSensor: 'Sıcaklık Sensörü', pressSensor: 'Basınç Sensörü',
    formTitle5: 'Tüketim Hesaplama Formülleri',
    errorInvalid: 'Hata: Geçersiz veya uyumsuz JSON dosyası!', successImport: 'Dosya başarıyla yüklendi.', 
    successFinish: 'Gemi yapılandırması hazır! Yukarıdan EXPORT edebilirsiniz.'
  },
  ENG: {
    welcome: 'Hi', startBtn: 'Start Create', nextBtn: 'Next', backBtn: 'Back', finishBtn: 'Finish',
    formTitle1: 'Vessel Identification', formTitle2: 'System & Network Settings', formTitle3: 'Machinery Components',formTitle4: 'Sensors',
    vesselName: 'Vessel Name', imoNumber: 'IMO Number', createdBy: 'Created By', fuel1: 'Fuel Type 1', fuel2: 'Fuel Type 2',
    gatewayIp: 'Gateway IP', installDate: 'Installation Date',
    mainEngine: 'Main Engine', generators: 'Generators', boiler: 'Boiler', shaftGen: 'Shaft Gen', turbineGen: 'Turbine Gen',
    flowmeter: 'Flowmeter', shaftMeter: 'Shaft Meter', powerMeter: 'Power Meter', tempSensor: 'Temp Sensor', pressSensor: 'Press Sensor',
    formTitle5: 'Consumption Formula Calculations',
    errorInvalid: 'Error: Invalid or incompatible JSON file!', successImport: 'File imported successfully.', 
    successFinish: 'Vessel configuration ready! You can EXPORT from top bar.'
  }
}

const t = (key) => translations[currentLang.value][key]
const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'TR' ? 'ENG' : 'TR'
  // Seçilen dili anında hafızaya kilitleyin
  localStorage.setItem('vessel_app_lang', currentLang.value)
}

const showStatus = (msg) => {
  statusMessage.value = msg
  setTimeout(() => statusMessage.value = '', 5000)
}

const exportJson = () => {
  if (!vesselData.vesselName) return
  
  const fuelsInUse = []
  if (vesselData.fuel1) {
    const f1 = fuelsList.find(f => f.id === vesselData.fuel1)
    if (f1) fuelsInUse.push(f1)
  }
  if (vesselData.fuel2) {
  const f2 = fuelsList.find(f => f.id === vesselData.fuel2)
    if (f2) fuelsInUse.push(f2)
  }
const finalOutput = {
    ...vesselData,
    fuelsInUse: fuelsInUse, // Seçilenlerin detaylı listesi
    fuels: fuelsList        // Editör için tüm listenin ham hali
  }
  const finalData = JSON.stringify(finalOutput, null, 2)
  const blob = new Blob([finalData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${vesselData.vesselName}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => fileInput.value.click()

const importJson = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      if ('vesselName' in parsed) {
        Object.assign(vesselData, parsed)
        isWizardFinished.value = true
        step.value = 2
        showStatus(t('successImport'))
      } else { alert(t('errorInvalid')) }
    } catch { alert(t('errorInvalid')) }
  }
  reader.readAsText(file)
  event.target.value = ''
}
</script>

<style>
/* Orijinal ve Kararlı Sabit Kutu Boyutları */
.app-container {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: #121212; color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px; box-sizing: border-box;
}
.card {
  background-color: #1e1e1e; border: 1px solid #2d2d2d; border-radius: 12px;
  padding: 30px; width: 100%; max-width: 450px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6); box-sizing: border-box;
}
.form-title { font-size: 1.3rem; margin-top: 0; margin-bottom: 25px; color: #ffffff; text-align: center; border-bottom: 1px solid #2d2d2d; padding-bottom: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.form-group label { font-size: 0.85rem; color: #aaaaaa; }
.form-group input { background-color: #252525; border: 1px solid #3d3d3d; border-radius: 6px; padding: 12px; color: #fff; font-size: 1rem; outline: none; transition: border-color 0.2s; }
.form-group input:focus { border-color: #4fc08d; }
.wizard-actions { margin-top: 30px; }
.dual-buttons { display: flex; gap: 15px; }
.action-btn { background-color: #4fc08d; color: #121212; border: none; border-radius: 8px; padding: 14px 28px; font-size: 1rem; font-weight: bold; cursor: pointer; width: 100%; transition: background-color 0.2s; }
.action-btn:hover:not(:disabled) { background-color: #3aa876; }
.action-btn:disabled { background-color: #2d2d2d; color: #666; cursor: not-allowed; }
.back-btn { background-color: #252525; border: 1px solid #3d3d3d; color: #eee; border-radius: 8px; padding: 14px 24px; font-size: 1rem; cursor: pointer; width: 40%; transition: all 0.2s; }
.back-btn:hover { background-color: #2d2d2d; border-color: #aaa; }
@media (max-width: 480px) { .card { padding: 20px; } }
</style>