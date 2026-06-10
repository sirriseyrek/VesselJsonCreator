<template>
  <header class="top-bar">
    <div class="action-buttons">
      <button class="nav-btn" @click="$emit('import')">IMPORT</button>
      <button class="nav-btn" @click="$emit('export')" :disabled="!isReadyToExport">EXPORT</button>
    </div>
    <button class="lang-btn" @click="$emit('toggle-lang')">
      {{ currentLang === 'TR' ? 'ENG' : 'TUR' }}
    </button>
  </header>
</template>

<script setup>
defineProps(['currentLang', 'isReadyToExport'])
defineEmits(['import', 'export', 'toggle-lang'])
</script>

<style scoped>
.top-bar {
  position: absolute;
  top: 0; left: 0; width: 100%;
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 20px; box-sizing: border-box;
  background-color: #1a1a1a; border-bottom: 1px solid #2d2d2d;
}
.action-buttons { display: flex; gap: 10px; }
.nav-btn, .lang-btn {
  background-color: #242424; border: 1px solid #3d3d3d; color: #fff;
  padding: 8px 16px; font-size: 14px; font-weight: 600; border-radius: 6px;
  cursor: pointer; transition: all 0.2s ease;
}
.nav-btn:disabled { opacity: 0.2; cursor: not-allowed; border-color: #252525; }
.nav-btn:hover:not(:disabled), .lang-btn:hover { background-color: #2d2d2d; border-color: #4fc08d; }
</style>